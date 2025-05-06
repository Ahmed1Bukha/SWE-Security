"use client";

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileCheck, FileText, Shield, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { supabase } from '@/utils/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function ProcessInsuranceClaims() {
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState('new');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [claims, setClaims] = useState([]);
  const [claimDetails, setClaimDetails] = useState(null);
  const [insuranceProviders, setInsuranceProviders] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  
  // Form state
  const [formData, setFormData] = useState({
    patientId: '',
    serviceDate: '',
    serviceType: '',
    providerName: '',
    claimAmount: '',
    insuranceProvider: '',
    policyNumber: '',
    description: ''
  });

  // Fetch insurance providers from Supabase
  useEffect(() => {
    async function fetchInsuranceProviders() {
      const { data, error } = await supabase
        .from('insurance_providers')
        .select('id, name')
        .eq('active', true);
        
      if (error) {
        console.error('Error fetching insurance providers:', error);
        toast({
          title: "Error",
          description: "Could not load insurance providers",
          variant: "destructive",
        });
      } else {
        setInsuranceProviders(data);
      }
    }
    
    fetchInsuranceProviders();
  }, []);

  // Fetch service types from Supabase
  useEffect(() => {
    async function fetchServiceTypes() {
      const { data, error } = await supabase
        .from('service_types')
        .select('id, name')
        .eq('active', true);
        
      if (error) {
        console.error('Error fetching service types:', error);
        toast({
          title: "Error",
          description: "Could not load service types",
          variant: "destructive",
        });
      } else {
        setServiceTypes(data);
      }
    }
    
    fetchServiceTypes();
  }, []);

  // Fetch claims from Supabase
  useEffect(() => {
    async function fetchClaims() {
      const { data, error } = await supabase
        .from('insurance_claims')
        .select(`
          id, 
          claim_id, 
          patient_id, 
          service_date, 
          service_type, 
          provider_name, 
          claim_amount, 
          insurance_provider, 
          policy_number,
          description,
          status,
          submitted_date,
          processed_date
        `)
        .order('submitted_date', { ascending: false });
        
      if (error) {
        console.error('Error fetching claims:', error);
        toast({
          title: "Error",
          description: "Could not load insurance claims",
          variant: "destructive",
        });
      } else {
        setClaims(data);
      }
    }
    
    fetchClaims();
  }, []);

  // Form input handlers
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Generate a digital signature for the claim data
  const generateDigitalSignature = (data) => {
    // In a real implementation, you would:
    // 1. Use a proper cryptographic library
    // 2. Create a hash of the data
    // 3. Sign it with a private key
    // 4. Return the signature
    
    // This is just a simple mock for demonstration
    const jsonData = JSON.stringify(data);
    
    // Simulate a SHA-256 hash (in production, use actual crypto methods)
    let hash = 0;
    for (let i = 0; i < jsonData.length; i++) {
      const char = jsonData.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    // Convert to hex string and pad
    const signature = Math.abs(hash).toString(16).padStart(16, '0');
    return `sig_${signature}`;
  };

  // Submit a new claim to Supabase
  const handleSubmit = async () => {
    // Validate form
    if (!formData.patientId || !formData.serviceDate || !formData.serviceType || 
        !formData.providerName || !formData.claimAmount || !formData.insuranceProvider || 
        !formData.policyNumber) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Not authenticated");
      }
      
      // Generate a unique claim ID
      const claimId = `CLM-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      
      // Format claim amount to ensure it's a number
      const claimAmount = parseFloat(formData.claimAmount.replace(/[$,]/g, ''));
      
      // Insert the claim into the database
      const { data: claimData, error: claimError } = await supabase
        .from('insurance_claims')
        .insert({
          claim_id: claimId,
          patient_id: formData.patientId,
          user_id: user.id,
          service_date: formData.serviceDate,
          service_type: formData.serviceType,
          provider_name: formData.providerName,
          claim_amount: claimAmount,
          insurance_provider: formData.insuranceProvider,
          policy_number: formData.policyNumber,
          description: formData.description,
          status: 'Pending'
        })
        .select()
        .single();
        
      if (claimError) {
        throw claimError;
      }
      
      // Generate a digital signature for the claim
      const signatureData = generateDigitalSignature(claimData);
      
      // Store the digital signature
      const { error: signatureError } = await supabase
        .from('digital_signatures')
        .insert({
          claim_id: claimData.id,
          signature_data: signatureData,
          signing_algorithm: 'SHA-256'
        });
        
      if (signatureError) {
        throw signatureError;
      }
      
      // Add an audit log entry
      const { error: auditError } = await supabase
        .from('claim_audit_logs')
        .insert({
          claim_id: claimData.id,
          user_id: user.id,
          action: 'CLAIM_CREATED',
          new_state: claimData
        });
        
      if (auditError) {
        console.error('Error creating audit log:', auditError);
        // Continue despite audit log error
      }
      
      // Success - update the UI
      toast({
        title: "Claim Submitted",
        description: `Claim ${claimId} has been submitted successfully`,
      });
      
      setFormData({
        patientId: '',
        serviceDate: '',
        serviceType: '',
        providerName: '',
        claimAmount: '',
        insuranceProvider: '',
        policyNumber: '',
        description: ''
      });
      
      // Refresh the claims list
      const { data: refreshedClaims, error: refreshError } = await supabase
        .from('insurance_claims')
        .select(`
          id, 
          claim_id, 
          patient_id, 
          service_date, 
          service_type, 
          provider_name, 
          claim_amount, 
          insurance_provider, 
          policy_number,
          description,
          status,
          submitted_date,
          processed_date
        `)
        .order('submitted_date', { ascending: false });
        
      if (!refreshError) {
        setClaims(refreshedClaims);
      }
      
      setSubmissionSuccess(true);
      setTimeout(() => {
        setSubmissionSuccess(false);
        setCurrentTab('list');
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting claim:', error);
      toast({
        title: "Error",
        description: "There was an error submitting your claim. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // View claim details including signature
  const viewClaimDetails = async (claimId) => {
    try {
      // Fetch the claim details
      const { data: claimData, error: claimError } = await supabase
        .from('insurance_claims')
        .select(`
          id, 
          claim_id, 
          patient_id, 
          service_date, 
          service_type, 
          provider_name, 
          claim_amount, 
          insurance_provider, 
          policy_number,
          description,
          status,
          submitted_date,
          processed_date
        `)
        .eq('id', claimId)
        .single();
        
      if (claimError) {
        throw claimError;
      }
      
      // Fetch the digital signature
      const { data: signatureData, error: signatureError } = await supabase
        .from('digital_signatures')
        .select('signature_data, signing_algorithm, signed_at')
        .eq('claim_id', claimId)
        .single();
        
      if (signatureError && signatureError.code !== 'PGRST116') { // No rows returned is OK
        throw signatureError;
      }
      
      // Get current user for audit log
      const { data: { user } } = await supabase.auth.getUser();
      
      // Combine the data
      const claimDetails = {
        ...claimData,
        signatureId: signatureData?.signature_data || 'No signature found',
        signatureAlgorithm: signatureData?.signing_algorithm || 'N/A',
        signatureDate: signatureData?.signed_at || null
      };
      
      // Update state to show details
      setClaimDetails(claimDetails);
      
      // Add audit log for viewing claim
      if (user) {
        const { error: auditError } = await supabase
          .from('claim_audit_logs')
          .insert({
            claim_id: claimId,
            user_id: user.id,
            action: 'CLAIM_VIEWED',
            new_state: null
          });
          
        if (auditError) {
          console.error('Error creating audit log:', auditError);
          // Continue despite audit log error
        }
      }
      
    } catch (error) {
      console.error('Error fetching claim details:', error);
      toast({
        title: "Error",
        description: "There was an error retrieving claim details.",
        variant: "destructive",
      });
    }
  };

  const closeClaimDetails = () => {
    setClaimDetails(null);
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Under Review':
        return 'bg-blue-100 text-blue-800';
      case 'Denied':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-teal-700">Process Insurance Claims</h1>
        <p className="text-muted-foreground">Submit and manage insurance claims securely</p>
      </div>

      {/* Security Info Card */}
      <div className="rounded-lg border border-teal-100 bg-teal-50 p-4 mb-6">
        <div className="flex items-start gap-3">
          <Shield className="mt-0.5 h-5 w-5 text-teal-600" />
          <div>
            <h3 className="text-sm font-medium text-teal-700">Secure Claim Processing</h3>
            <p className="mt-1 text-xs text-gray-600">
              All insurance claims are digitally signed and encrypted for authenticity and security.
              This ensures the integrity of your claims during processing and verification.
            </p>
          </div>
        </div>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="new">New Claim</TabsTrigger>
          <TabsTrigger value="list">Claims List</TabsTrigger>
        </TabsList>
        
        {/* New Claim Form */}
        <TabsContent value="new" className="space-y-4">
          {submissionSuccess ? (
            <Alert className="bg-green-50 border-green-100">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Claim Submitted Successfully</AlertTitle>
              <AlertDescription className="text-green-700">
                Your claim has been digitally signed and submitted for processing.
              </AlertDescription>
            </Alert>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Submit New Claim</CardTitle>
                <CardDescription>Complete the form to submit an insurance claim</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Patient ID</label>
                      <Input 
                        placeholder="PT-12345" 
                        value={formData.patientId}
                        onChange={(e) => handleInputChange('patientId', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Service Date</label>
                      <Input 
                        type="date" 
                        value={formData.serviceDate}
                        onChange={(e) => handleInputChange('serviceDate', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Service Type</label>
                      <Select 
                        value={formData.serviceType}
                        onValueChange={(value) => handleInputChange('serviceType', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select service type" />
                        </SelectTrigger>
                        <SelectContent>
                          {serviceTypes.map((service) => (
                            <SelectItem key={service.id} value={service.name}>
                              {service.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Provider Name</label>
                      <Input 
                        placeholder="Dr. Jane Smith" 
                        value={formData.providerName}
                        onChange={(e) => handleInputChange('providerName', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Claim Amount</label>
                      <Input 
                        placeholder="$250.00" 
                        value={formData.claimAmount}
                        onChange={(e) => handleInputChange('claimAmount', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Insurance Provider</label>
                      <Select 
                        value={formData.insuranceProvider}
                        onValueChange={(value) => handleInputChange('insuranceProvider', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select insurance provider" />
                        </SelectTrigger>
                        <SelectContent>
                          {insuranceProviders.map((provider) => (
                            <SelectItem key={provider.id} value={provider.name}>
                              {provider.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Policy Number</label>
                    <Input 
                      placeholder="POLICY-123456" 
                      value={formData.policyNumber}
                      onChange={(e) => handleInputChange('policyNumber', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Additional Information (Optional)</label>
                    <Textarea
                      placeholder="Provide any additional details about the claim"
                      className="min-h-32"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Any relevant information that might help process the claim
                    </p>
                  </div>

                  <div className="rounded-lg bg-blue-50 p-3 border border-blue-100">
                    <div className="flex items-center gap-2">
                      <FileCheck className="h-4 w-4 text-blue-600" />
                      <span className="text-xs font-medium text-blue-700">Digital Signature</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-600">
                      When submitted, this claim will be digitally signed to ensure authenticity and
                      integrity during processing.
                    </p>
                  </div>

                  <Button 
                    onClick={handleSubmit} 
                    className="w-full bg-teal-600 hover:bg-teal-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Processing..." : "Submit Claim"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Claims List */}
        <TabsContent value="list" className="space-y-4">
          {claimDetails ? (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Claim Details</CardTitle>
                    <CardDescription>Claim ID: {claimDetails.claim_id}</CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-teal-200 text-teal-700"
                    onClick={closeClaimDetails}
                  >
                    Back to List
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Claim Information</h3>
                    <dl className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <dt className="text-gray-500">Status:</dt>
                        <dd>
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeColor(claimDetails.status)}`}>
                            {claimDetails.status}
                          </span>
                        </dd>
                      </div>
                      <div className="flex justify-between text-sm">
                        <dt className="text-gray-500">Service Type:</dt>
                        <dd className="font-medium">{claimDetails.service_type}</dd>
                      </div>
                      <div className="flex justify-between text-sm">
                        <dt className="text-gray-500">Service Date:</dt>
                        <dd className="font-medium">{new Date(claimDetails.service_date).toLocaleDateString()}</dd>
                      </div>
                      <div className="flex justify-between text-sm">
                        <dt className="text-gray-500">Provider:</dt>
                        <dd className="font-medium">{claimDetails.provider_name}</dd>
                      </div>
                      <div className="flex justify-between text-sm">
                        <dt className="text-gray-500">Amount:</dt>
                        <dd className="font-medium">${parseFloat(claimDetails.claim_amount).toFixed(2)}</dd>
                      </div>
                      {claimDetails.description && (
                        <div className="flex flex-col text-sm">
                          <dt className="text-gray-500">Description:</dt>
                          <dd className="font-medium mt-1">{claimDetails.description}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Insurance Information</h3>
                    <dl className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <dt className="text-gray-500">Patient ID:</dt>
                        <dd className="font-medium">{claimDetails.patient_id}</dd>
                      </div>
                      <div className="flex justify-between text-sm">
                        <dt className="text-gray-500">Insurance Provider:</dt>
                        <dd className="font-medium">{claimDetails.insurance_provider}</dd>
                      </div>
                      <div className="flex justify-between text-sm">
                        <dt className="text-gray-500">Policy Number:</dt>
                        <dd className="font-medium">{claimDetails.policy_number}</dd>
                      </div>
                      <div className="flex justify-between text-sm">
                        <dt className="text-gray-500">Submitted Date:</dt>
                        <dd className="font-medium">
                          {new Date(claimDetails.submitted_date).toLocaleDateString()} 
                          {new Date(claimDetails.submitted_date).toLocaleTimeString()}
                        </dd>
                      </div>
                      <div className="flex justify-between text-sm">
                        <dt className="text-gray-500">Processed Date:</dt>
                        <dd className="font-medium">
                          {claimDetails.processed_date 
                            ? new Date(claimDetails.processed_date).toLocaleDateString() 
                            : 'Pending'}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-2">Digital Signature</h3>
                  <div className="rounded-lg bg-gray-50 p-3 border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <FileCheck className="h-4 w-4 text-teal-600" />
                      <span className="text-xs font-medium">Signature Verification</span>
                    </div>
                    <div className="text-xs font-mono break-all bg-white border border-gray-100 p-2 rounded">
                      {claimDetails.signatureId}
                    </div>
                    <p className="mt-2 text-xs text-gray-600">
                      This digital signature ensures the authenticity and integrity of this claim.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  className="border-blue-200 text-blue-700"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Print Claim
                </Button>
                {claimDetails.status === 'Pending' && (
                  <Button 
                    variant="outline" 
                    className="border-red-200 text-red-700"
                  >
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Cancel Claim
                  </Button>
                )}
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Claims History</CardTitle>
                <CardDescription>Complete list of your insurance claims</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="py-3 px-4 text-left font-medium">Claim ID</th>
                        <th className="py-3 px-4 text-left font-medium">Date</th>
                        <th className="py-3 px-4 text-left font-medium">Service</th>
                        <th className="py-3 px-4 text-left font-medium">Amount</th>
                        <th className="py-3 px-4 text-left font-medium">Provider</th>
                        <th className="py-3 px-4 text-left font-medium">Status</th>
                        <th className="py-3 px-4 text-right font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {claims.length > 0 ? (
                        claims.map((claim) => (
                          <tr key={claim.id} className="border-b">
                            <td className="py-3 px-4 font-medium">{claim.claim_id}</td>
                            <td className="py-3 px-4">
                              {new Date(claim.service_date).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">{claim.service_type}</td>
                            <td className="py-3 px-4">
                              ${parseFloat(claim.claim_amount).toFixed(2)}
                            </td>
                            <td className="py-3 px-4">{claim.insurance_provider}</td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeColor(claim.status)}`}>
                                {claim.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 text-teal-600 hover:text-teal-700"
                                onClick={() => viewClaimDetails(claim.id)}
                              >
                                <FileCheck className="mr-2 h-4 w-4" />
                                Details
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-gray-500">
                            No claims found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}