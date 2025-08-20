import BannerSliderDB from './components/BannerSliderDB';
import RecentExhibitionsDB from './components/RecentExhibitionsDB';
import GallerySpaces from './components/GallerySpaces';

export default function Home() {
  return (
    <>
      <BannerSliderDB />
      <RecentExhibitionsDB />
      <GallerySpaces />
    </>
  );
}
