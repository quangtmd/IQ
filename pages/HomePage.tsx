
import React from 'react';
import HomeBannerIts from '../components/home/iqtechnology/HomeBannerIts';
import HomeAboutIts from '../components/home/iqtechnology/HomeAboutIts';
import HomeServicesBenefitsIts from '../components/home/iqtechnology/HomeServicesBenefitsIts';
import HomeWhyChooseUsIts from '../components/home/iqtechnology/HomeWhyChooseUsIts';
import HomeStatsCounterIts from '../components/home/iqtechnology/HomeStatsCounterIts';
import HomeFeaturedProjectsIts from '../components/home/iqtechnology/HomeFeaturedProjectsIts';
import HomeTestimonialsIts from '../components/home/iqtechnology/HomeTestimonialsIts';
import HomeBrandLogosIts from '../components/home/iqtechnology/HomeBrandLogosIts';
import HomeProcessIts from '../components/home/iqtechnology/HomeProcessIts';
import HotProducts from '../components/home/HotProducts'; // Changed import
import HomeBlogPreviewIts from '../components/home/iqtechnology/HomeBlogPreviewIts';
import HomeContactIts from '../components/home/iqtechnology/HomeContactIts';

const HomePage: React.FC = () => {
  return (
    <div>
      <HomeBannerIts />
      <HomeAboutIts />
      <HomeServicesBenefitsIts />
      <HomeWhyChooseUsIts />
      <HomeStatsCounterIts />
      <HomeFeaturedProjectsIts />
      <HomeTestimonialsIts />
      <HomeBrandLogosIts />
      <HomeProcessIts />
      <HotProducts /> {/* Replaced HomeCallToActionIts */}
      <HomeBlogPreviewIts />
      <HomeContactIts />
    </div>
  );
};

export default HomePage;