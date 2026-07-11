'use client';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { TechnologySummary } from '@/types/technology';
import React from 'react';
import { FiGlobe, FiLock, FiTag } from 'react-icons/fi';
import { TechnologyPicker } from './TechnologyPicker';

interface NoteEditorSettingsProps {
  visibility: 'PRIVATE' | 'PUBLIC';
  onVisibilityChange: (val: 'PRIVATE' | 'PUBLIC') => void;
  technology: TechnologySummary | null;
  onTechnologyChange: (technology: TechnologySummary) => void;
  technologyError?: string;
}

export const NoteEditorSettings: React.FC<NoteEditorSettingsProps> = ({
  visibility,
  onVisibilityChange,
  technology,
  onTechnologyChange,
  technologyError,
}) => {
  return (
    <div className="lg:sticky lg:top-24 space-y-4">
      <div className="p-4 sm:p-5 border rounded-xl bg-card/60 backdrop-blur-sm shadow-2xs space-y-4 transition-all hover:shadow-xs">
        <div className="flex items-center gap-2 border-b pb-2.5 text-foreground font-semibold">
          <FiTag className="w-3.5 h-3.5 text-primary" />
          <h3 className="text-sm tracking-tight font-bold">Note Settings</h3>
        </div>

        {/* Visibility Setting */}
        <div className="space-y-2">
          <Label htmlFor="visibility-switch" className="font-semibold text-xs flex items-center justify-between">
            <span>Visibility</span>
            <span className="text-[11px] font-normal text-muted-foreground">
              {visibility === 'PUBLIC' ? 'Public' : 'Private'}
            </span>
          </Label>
          
          <div className="flex items-center justify-between p-3 rounded-lg border bg-background/50 hover:bg-background/80 transition-colors">
            <div className="flex items-center gap-2.5">
              <div className={`p-1.5 rounded-md ${visibility === 'PUBLIC' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                {visibility === 'PUBLIC' ? <FiGlobe className="w-3.5 h-3.5" /> : <FiLock className="w-3.5 h-3.5" />}
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-semibold leading-none">
                  {visibility === 'PUBLIC' ? 'Public Note' : 'Private Note'}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {visibility === 'PUBLIC' ? 'Visible to everyone' : 'Only visible to you'}
                </p>
              </div>
            </div>

            <Switch
              id="visibility-switch"
              checked={visibility === 'PUBLIC'}
              onCheckedChange={(checked) =>
                onVisibilityChange(checked ? 'PUBLIC' : 'PRIVATE')
              }
            />
          </div>
        </div>

        {/* Technology Setting */}
        <div className="space-y-2">
          <Label className="font-semibold text-xs">Technology</Label>
          <TechnologyPicker
            value={technology}
            onChange={onTechnologyChange}
            error={technologyError}
          />
        </div>
      </div>

      {/* Status Card inspired by mockup .sidebar-widget */}
      <div className="p-4 border rounded-xl bg-card/40 backdrop-blur-sm shadow-2xs space-y-2">
        <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          <span>Editor Status</span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Your changes will be saved to your library upon publishing.
        </p>
      </div>
    </div>
  );
};
