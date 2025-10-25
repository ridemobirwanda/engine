import AdManager from './AdManager';

export const SidebarAd = () => {
  return (
    <div className="sticky top-4">
      <AdManager position="sidebar" size="medium" className="mb-4" />
    </div>
  );
};

export default SidebarAd;
