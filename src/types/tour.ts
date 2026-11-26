export type Locale = "id" | "en";

export type LocalizedString = {
  id: string;
  en?: string;
};

export type TourLink = {
  targetSceneId: string;
  label: LocalizedString;
  /** Degrees. 0 = straight ahead, positive = right */
  yaw: number;
  /** Degrees. positive = up */
  pitch: number;
};

export type TourScene = {
  id: string;
  title: LocalizedString;
  image: string;
  thumbnail: string;
};

export type TourPhoto = {
  src: string;
  alt: LocalizedString;
};

export type TourVideo = {
  id: string;
  title: LocalizedString;
  src: string;
  poster: string;
};

export type TourArea = {
  id: string;
  title: LocalizedString;
  shortDescription: LocalizedString;
  description: LocalizedString;
  scenes: TourScene[];
  links: TourLink[];
  photos: TourPhoto[];
  videos: TourVideo[];
};

export type SiteContent = {
  meta: {
    title: LocalizedString;
    description: LocalizedString;
  };
  home: {
    brandName: string;
    heroParagraph: LocalizedString;
    ctaStartTour: LocalizedString;
    areasHeading: LocalizedString;
    areasIntro: LocalizedString;
    openAreaCta: LocalizedString;
  };
  footer: {
    contactHeading: LocalizedString;
    address: LocalizedString;
    phone: LocalizedString;
    email: LocalizedString;
    note: LocalizedString;
  };
  tour: {
    sectionHeading: LocalizedString;
    sectionIntro: LocalizedString;
    dragHint: LocalizedString;
    prevScene: LocalizedString;
    nextScene: LocalizedString;
    infoButton: LocalizedString;
    closeInfo: LocalizedString;
    sceneThumbLabel: LocalizedString;
    photosHeading: LocalizedString;
    videosHeading: LocalizedString;
    playVideo: LocalizedString;
    pauseVideo: LocalizedString;
    muteVideo: LocalizedString;
    unmuteVideo: LocalizedString;
    closeVideo: LocalizedString;
    backFromVideoVr: LocalizedString;
  };
  areas: TourArea[];
};
