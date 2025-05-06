'use client';

import { Card } from '@/components/ui/card';
import { Users, FileText, Activity, AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
  // Mock data - replace with real data from your API
  const stats = [
    {
      title: 'Total Users',
      value: '1,234',
      icon: Users,
      change: '+12%',
      color: 'text-blue-500',
    },
    {
      title: 'Medical Records',
      value: '5,678',
      icon: FileText,
      change: '+8%',
      color: 'text-green-500',
    },
    {
      title: 'Active Sessions',
      value: '89',
      icon: Activity,
      change: '+23%',
      color: 'text-purple-500',
    },
    {
      title: 'Pending Issues',
      value: '12',
      icon: AlertCircle,
      change: '-4%',
      color: 'text-red-500',
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <h2 className="text-2xl font-bold mt-2">{stat.value}</h2>
                <p className={`text-sm mt-2 ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change} from last month
                </p>
              </div>
              <div className={`p-3 rounded-full bg-accent ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <div>
                  <p className="text-sm font-medium">User action performed</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">System Status</h2>
          <div className="space-y-4">
            {[
              { name: 'Database', status: 'Healthy' },
              { name: 'API Services', status: 'Healthy' },
              { name: 'Authentication', status: 'Healthy' },
            ].map((service, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm">{service.name}</span>
                <span className="text-sm text-green-500">{service.status}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
