import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription } from
'../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  MousePointerClick,
  Eye,
  MessageCircle,
  Share2,
  Lightbulb } from
'lucide-react';
export const Analytics = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-brown">
            Performance Analytics
          </h2>
          <p className="text-slate-500">
            Track your growth and AI optimization impact.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select className="h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last Quarter</option>
            <option>Year to Date</option>
          </select>
          <Button variant="outline" leftIcon={<Share2 size={16} />}>
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
        {
          label: 'Total Impressions',
          value: '124.5k',
          change: '+12.5%',
          trend: 'up',
          icon: Eye
        },
        {
          label: 'Engagement Rate',
          value: '4.8%',
          change: '+0.8%',
          trend: 'up',
          icon: MessageCircle
        },
        {
          label: 'Link Clicks',
          value: '3,240',
          change: '-2.1%',
          trend: 'down',
          icon: MousePointerClick
        },
        {
          label: 'Conversions',
          value: '145',
          change: '+18.2%',
          trend: 'up',
          icon: BarChart3
        }].
        map((stat, i) =>
        <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                  <stat.icon size={20} />
                </div>
                <Badge
                variant={stat.trend === 'up' ? 'success' : 'error'}
                className="flex items-center gap-1">
                
                  {stat.trend === 'up' ?
                <ArrowUpRight size={12} /> :

                <ArrowDownRight size={12} />
                }
                  {stat.change}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {stat.label}
                </p>
                <h3 className="text-2xl font-bold text-brown">
                  {stat.value}
                </h3>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Chart Area (Simulated) */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Audience Growth</CardTitle>
            <CardDescription>
              Follower growth across all connected platforms.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full flex items-end justify-between gap-2 pt-4">
              {[35, 42, 38, 45, 55, 52, 60, 65, 58, 70, 75, 82].map((h, i) =>
              <div
                key={i}
                className="w-full bg-brand-50 rounded-t-sm relative group hover:bg-brand-100 transition-colors">
                
                  <div
                  className="absolute bottom-0 left-0 right-0 bg-brand-600 rounded-t-sm transition-all duration-500 group-hover:bg-brand-700"
                  style={{
                    height: `${h}%`
                  }} />
                
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-brand-900 text-white text-xs py-1 px-2 rounded pointer-events-none transition-opacity">
                    {h * 100}
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-between mt-4 text-xs text-slate-400">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
              <span>Nov</span>
              <span>Dec</span>
            </div>
          </CardContent>
        </Card>

        {/* AI Insights */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-brand-600 to-brand-700 text-white border-none">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="h-5 w-5 text-yellow-300" />
                <h3 className="font-bold text-lg">AI Optimization</h3>
              </div>
              <p className="text-brand-100 mb-6 leading-relaxed">
                Based on recent performance, posting educational carousels on
                LinkedIn between 8-10 AM EST is driving 40% higher engagement.
              </p>
              <Button className="w-full bg-white text-brand-600 hover:bg-brand-50 border-none">
                Adjust Schedule
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Content</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {[
              {
                title: '5 AI Tools for Design',
                views: '12.5k',
                platform: 'LinkedIn'
              },
              {
                title: 'Remote Work Trends',
                views: '8.2k',
                platform: 'Twitter'
              },
              {
                title: 'Product Launch Teaser',
                views: '5.1k',
                platform: 'Instagram'
              }].
              map((post, i) =>
              <div
                key={i}
                className="flex items-center justify-between p-4 border-b border-slate-100 last:border-0 hover:bg-cream transition-colors">
                
                  <div>
                    <p className="font-medium text-brown text-sm truncate max-w-[180px]">
                      {post.title}
                    </p>
                    <p className="text-xs text-slate-500">{post.platform}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-brown text-sm">
                      {post.views}
                    </p>
                    <p className="text-xs text-slate-500">views</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>);

};