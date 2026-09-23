import React from 'react';
import { Link } from '../context/RouterContext';
import { TOOLS } from '../utils/seoData';
import { 
  Minimize2, 
  Maximize2, 
  FileCode2, 
  FileImage, 
  RefreshCw, 
  Crop, 
  ArrowRight 
} from 'lucide-react';

interface RelatedToolsProps {
  relatedIds: string[];
  currentId?: string;
  title?: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Minimize2,
  Maximize2,
  FileCode2,
  FileImage,
  RefreshCw,
  Crop,
};

export const RelatedTools: React.FC<RelatedToolsProps> = ({
  relatedIds,
  currentId,
  title = 'Related Image Tools',
}) => {
  const toolsToShow = TOOLS.filter(
    (t) => relatedIds.includes(t.id) && t.id !== currentId
  );

  if (toolsToShow.length === 0) return null;

  return (
    <section className="my-12 w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {title}
        </h2>
        <Link
          href="/image-tools"
          className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 inline-flex items-center gap-1"
        >
          View all tools
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {toolsToShow.map((tool) => {
          const IconComponent = iconMap[tool.icon] || FileImage;
          return (
            <Link
              key={tool.id}
              href={tool.path}
              className="group relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 hover:border-blue-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 transition-all"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {tool.category}
                  </span>
                </div>
                <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {tool.name}
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {tool.shortDescription}
                </p>
              </div>

              <div className="mt-4 flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform">
                Open tool
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
