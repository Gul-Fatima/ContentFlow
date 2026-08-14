import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription } from
'../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Textarea } from '../components/ui/Textarea';
import { Tabs } from '../components/ui/Tabs';
import { Badge } from '../components/ui/Badge';
import {
  Save,
  Plus,
  Trash2,
  Mic2,
  Users,
  ShieldAlert,
  Edit3 } from
'lucide-react';
export const BrandMemory = () => {
  const [activeTab, setActiveTab] = useState('voice');
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-brown">Brand Memory</h2>
          <p className="text-slate-500">
            Configure how the AI represents your brand across channels.
          </p>
        </div>
        <Button leftIcon={<Save size={16} />}>Save Changes</Button>
      </div>

      <Tabs
        activeTab={activeTab}
        onChange={setActiveTab}
        tabs={[
        {
          id: 'voice',
          label: 'Voice & Tone'
        },
        {
          id: 'rules',
          label: 'Content Rules'
        },
        {
          id: 'personas',
          label: 'Audience Personas'
        },
        {
          id: 'competitors',
          label: 'Competitors'
        }]
        } />
      

      {activeTab === 'voice' &&
      <div className="grid gap-8 md:grid-cols-2">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic2 className="h-5 w-5 text-brand-600" />
                Brand Voice Description
              </CardTitle>
              <CardDescription>
                Describe your brand's personality, values, and communication
                style. The AI uses this as a base prompt.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
              className="min-h-[150px] text-base"
              defaultValue="We are a helpful, authoritative, yet accessible SaaS brand. We speak to social media managers as peers, understanding their pain points but offering professional solutions. Our tone is optimistic, data-driven, and slightly witty but never unprofessional. We avoid jargon unless it's industry-standard." />
            
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tone Sliders</CardTitle>
              <CardDescription>
                Adjust the nuances of your content.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-3">
                <div className="flex justify-between text-sm font-medium text-slate-700">
                  <span>Casual</span>
                  <span>Formal</span>
                </div>
                <input
                type="range"
                className="w-full accent-brand-600"
                defaultValue="60" />
              
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm font-medium text-slate-700">
                  <span>Playful</span>
                  <span>Serious</span>
                </div>
                <input
                type="range"
                className="w-full accent-brand-600"
                defaultValue="40" />
              
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm font-medium text-slate-700">
                  <span>Short & Punchy</span>
                  <span>Detailed</span>
                </div>
                <input
                type="range"
                className="w-full accent-brand-600"
                defaultValue="30" />
              
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Keywords</CardTitle>
              <CardDescription>Words to emphasize or avoid.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Power Words (Use often)
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {['Growth', 'Scale', 'Automate', 'Strategy', 'ROI'].map(
                  (word) =>
                  <Badge key={word} variant="success" className="px-3 py-1">
                        {word}
                      </Badge>

                )}
                  <button className="inline-flex items-center justify-center rounded-full border border-dashed border-slate-300 px-3 py-1 text-xs font-medium text-slate-500 hover:bg-cream">
                    <Plus size={12} className="mr-1" /> Add
                  </button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Negative Words (Avoid)
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Cheap', 'Hack', 'Viral', 'Guaranteed'].map((word) =>
                <Badge key={word} variant="error" className="px-3 py-1">
                      {word}
                    </Badge>
                )}
                  <button className="inline-flex items-center justify-center rounded-full border border-dashed border-slate-300 px-3 py-1 text-xs font-medium text-slate-500 hover:bg-cream">
                    <Plus size={12} className="mr-1" /> Add
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      }

      {activeTab === 'rules' &&
      <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-brand-600" />
                Content Guidelines
              </CardTitle>
              <CardDescription>
                Strict rules the AI must follow for every post.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {[
              'Always use Oxford commas',
              'Never mention competitors by name',
              'Emojis should be used sparingly (max 2 per post)',
              'Always include a Call to Action (CTA)',
              'Dates must be in US format (MM/DD/YYYY)'].
              map((rule, i) =>
              <li
                key={i}
                className="flex items-center justify-between p-3 bg-cream rounded-lg border border-slate-100 group">
                
                    <span className="text-slate-700">{rule}</span>
                    <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100">
                  
                      <Trash2 size={16} />
                    </Button>
                  </li>
              )}
              </ul>
              <Button
              variant="outline"
              className="w-full mt-4 border-dashed"
              leftIcon={<Plus size={16} />}>
              
                Add New Rule
              </Button>
            </CardContent>
          </Card>
        </div>
      }

      {activeTab === 'personas' &&
      <div className="grid gap-6 md:grid-cols-2">
          {[
        {
          name: 'The Busy Founder',
          role: 'Startup CEO',
          pain: 'No time for consistency'
        },
        {
          name: 'Agency Alice',
          role: 'Social Media Manager',
          pain: 'Overwhelmed by client approvals'
        },
        {
          name: 'Marketing Mike',
          role: 'CMO',
          pain: 'Need to prove ROI to board'
        }].
        map((persona, i) =>
        <Card key={i} className="relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-brand-500" />
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-slate-400" />
                    {persona.name}
                  </CardTitle>
                  <Button variant="ghost" size="sm">
                    <Edit3 size={16} />
                  </Button>
                </div>
                <CardDescription>{persona.role}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Pain Points
                    </span>
                    <p className="text-sm text-slate-700 mt-1">
                      {persona.pain}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Goals
                    </span>
                    <p className="text-sm text-slate-700 mt-1">
                      Efficiency, Scale, Automation
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
        )}
          <Card className="border-dashed flex items-center justify-center min-h-[200px] cursor-pointer hover:bg-cream transition-colors">
            <div className="text-center">
              <div className="h-12 w-12 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-3 text-brand-600">
                <Plus size={24} />
              </div>
              <h3 className="font-medium text-brown">Add Persona</h3>
            </div>
          </Card>
        </div>
      }
    </div>);

};