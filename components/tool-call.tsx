'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Wrench } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { Skeleton } from './ui/skeleton';

interface ToolCallProps {
  toolName: string;
  args?: any;
  result?: any;
  isLoading?: boolean;
}

export function ToolCall({
  toolName,
  args,
  result,
  isLoading = false,
}: ToolCallProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'json'>('table');

  // Format tool name for display (e.g., "GITHUB_CREATE_ISSUE" -> "GitHub Create Issue")
  const formatToolName = (name: string) => {
    return name
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Render parameters in table format
  const renderParametersTable = (params: any) => {
    if (!params || typeof params !== 'object') return null;

    return (
      <div className="max-h-64 overflow-auto rounded-md border p-4">
        <div className="space-y-2">
          {Object.entries(params).map(([key, value]) => (
            <div
              key={key}
              className="grid grid-cols-3 gap-4 py-2 border-b last:border-0"
            >
              <div className="font-mono text-sm text-muted-foreground">
                {key}
              </div>
              <div className="col-span-2 text-sm">
                {typeof value === 'object'
                  ? JSON.stringify(value, null, 2)
                  : String(value)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render response in table format (simplified for now)
  const renderResponseTable = (response: any) => {
    if (!response || typeof response !== 'object') return null;

    return (
      <div className="max-h-96 overflow-auto rounded-md border p-4">
        <div className="space-y-2">
          {Object.entries(response).map(([key, value]) => (
            <div
              key={key}
              className="grid grid-cols-3 gap-4 py-2 border-b last:border-0"
            >
              <div className="font-mono text-sm text-muted-foreground">
                {key}
              </div>
              <div className="col-span-2 text-sm">
                {typeof value === 'object' ? (
                  <pre className="whitespace-pre-wrap">
                    {JSON.stringify(value, null, 2)}
                  </pre>
                ) : (
                  String(value)
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wrench className="size-4" />
            <CardTitle className="text-base">
              {formatToolName(toolName)}
            </CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Calling tool section */}
        <div className="mb-4">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="size-4" />
            ) : (
              <ChevronDown className="size-4" />
            )}
            Calling tool {toolName}
          </button>
        </div>

        {isExpanded && (
          <div className="space-y-4">
            {/* View mode toggle */}
            {result && (
              <div className="flex justify-end">
                <Tabs
                  value={viewMode}
                  onValueChange={(v) => setViewMode(v as 'table' | 'json')}
                >
                  <TabsList className="grid w-[200px] grid-cols-2">
                    <TabsTrigger value="table">Table</TabsTrigger>
                    <TabsTrigger value="json">JSON</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            )}

            {/* Parameters section */}
            {args && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Parameters
                </h4>
                {viewMode === 'table' ? (
                  renderParametersTable(args)
                ) : (
                  <pre className="p-4 bg-muted rounded-md text-xs overflow-auto max-h-64">
                    {JSON.stringify(args, null, 2)}
                  </pre>
                )}
              </div>
            )}

            {/* Loading state */}
            {isLoading && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Response
                </h4>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            )}

            {/* Response section */}
            {result && !isLoading && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Response
                </h4>
                {viewMode === 'table' ? (
                  renderResponseTable(result)
                ) : (
                  <pre className="p-4 bg-muted rounded-md text-xs overflow-auto max-h-96">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
