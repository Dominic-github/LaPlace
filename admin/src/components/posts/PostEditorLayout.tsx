import React from 'react';

interface PostEditorLayoutProps {
  mainContent: React.ReactNode;
  sidebar: React.ReactNode;
}

/**
 * WordPress-style layout cho Post Editor
 * - Main content (bên trái): Title, Content editor
 * - Sidebar (bên phải): Publish, Categories, Tags, Featured Image, SEO
 */
export const PostEditorLayout: React.FC<PostEditorLayoutProps> = ({ mainContent, sidebar }) => {
  return (
    <div className="post-editor-layout">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Bên trái */}
        <div className="lg:col-span-2">
          <div className="post-editor-main space-y-4">
            {mainContent}
          </div>
        </div>

        {/* Sidebar - Bên phải */}
        <div className="lg:col-span-1">
          <div className="post-editor-sidebar space-y-4">
            {sidebar}
          </div>
        </div>
      </div>
    </div>
  );
};
