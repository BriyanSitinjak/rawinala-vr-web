import type { SiteContent } from "@/types/tour";

/** Indonesian-first content. Add `en` fields later for bilingual support. */
export const siteContent: SiteContent = {
  meta: {
    title: { id: "Rumah Harapan — Kunjungan Virtual" },
    description: {
      id: "Jelajahi rumah anak berkebutuhan khusus melalui tur virtual 360°.",
    },
  },
  home: {
    brandName: "Rumah Harapan",
    heroParagraph: {
      id: "Sebuah rumah yang merawat, mendidik, dan mendampingi anak berkebutuhan khusus — kini bisa Anda kunjungi dari mana saja.",
    },
    ctaStartTour: { id: "Mulai Kunjungan" },
    areasHeading: { id: "Jelajahi Area" },
    areasIntro: {
      id: "Pilih area untuk membuka tur 360°. Mode daftar ini juga tersedia bagi pengunjung yang membutuhkan alternatif aksesibel.",
    },
    openAreaCta: { id: "Buka di Tur" },
  },
  footer: {
    contactHeading: { id: "Kontak" },
    address: {
      id: "Jl. Harapan No. 12, Jakarta Selatan (alamat contoh untuk demo)",
    },
    phone: { id: "+62 21 0000 0000" },
    email: { id: "info@rumahharapan.demo" },
    note: {
      id: "Situs demo untuk presentasi klien. Konten dan aset bersifat contoh.",
    },
  },
  tour: {
    sectionHeading: { id: "Tur Virtual 360°" },
    sectionIntro: {
      id: "Seret untuk melihat sekeliling. Ketuk penanda untuk pindah area. Di ponsel, izinkan orientasi perangkat agar giroskop aktif.",
    },
    dragHint: { id: "Seret untuk melihat sekeliling" },
    prevScene: { id: "Adegan sebelumnya" },
    nextScene: { id: "Adegan berikutnya" },
    infoButton: { id: "Info" },
    closeInfo: { id: "Tutup info" },
    sceneThumbLabel: { id: "Pilih adegan" },
    photosHeading: { id: "Foto" },
    videosHeading: { id: "Video 360°" },
    playVideo: { id: "Putar" },
    pauseVideo: { id: "Jeda" },
    muteVideo: { id: "Bisukan" },
    unmuteVideo: { id: "Suarakan" },
    closeVideo: { id: "Tutup video" },
    backFromVideoVr: { id: "Kembali" },
  },
  areas: [
    {
      id: "eksterior",
      title: { id: "Eksterior" },
      shortDescription: {
        id: "Halaman depan dan gerbang rumah — kesan pertama bagi setiap tamu.",
      },
      description: {
        id: "Area eksterior menampilkan wajah Rumah Harapan: gerbang, jalur pejalan kaki, dan ruang terbuka yang ramah bagi anak dan pengunjung. Dari sini Anda bisa melanjutkan ke ruang kelas atau taman bermain.",
      },
      scenes: [
        {
          id: "eksterior-1",
          title: { id: "Halaman Depan" },
          image: "/demo/eksterior-1.jpg",
          thumbnail: "/demo/eksterior-1-thumb.jpg",
        },
      ],
      links: [
        {
          targetSceneId: "kelas-1",
          label: { id: "Ke Ruang Kelas" },
          yaw: 45,
          pitch: 0,
        },
        {
          targetSceneId: "taman-1",
          label: { id: "Ke Taman Bermain" },
          yaw: -60,
          pitch: -5,
        },
      ],
      photos: [
        {
          src: "/demo/photo-eksterior-a.jpg",
          alt: { id: "Gerbang dan halaman depan Rumah Harapan" },
        },
        {
          src: "/demo/photo-eksterior-b.jpg",
          alt: { id: "Jalur pejalan kaki di area luar" },
        },
      ],
      videos: [
        {
          id: "eksterior-video-1",
          title: { id: "Sekilas Halaman Depan" },
          src: "/demo/video-sample.mp4",
          poster: "/demo/video-sample-poster.jpg",
        },
        {
          id: "eksterior-video-2",
          title: { id: "Suasana Pagi di Eksterior" },
          src: "/demo/video-sample.mp4",
          poster: "/demo/video-sample-poster.jpg",
        },
      ],
    },
    {
      id: "ruang-kelas",
      title: { id: "Ruang Kelas" },
      shortDescription: {
        id: "Ruang belajar yang aman, terang, dan mendukung setiap anak.",
      },
      description: {
        id: "Ruang kelas dirancang agar nyaman bagi anak berkebutuhan khusus: pencahayaan lembut, area aktivitas, dan sudut tenang. Tur ini menampilkan dua sudut pandang di dalam ruang yang sama.",
      },
      scenes: [
        {
          id: "kelas-1",
          title: { id: "Ruang Kelas — Sudut Meja" },
          image: "/demo/kelas-1.jpg",
          thumbnail: "/demo/kelas-1-thumb.jpg",
        },
        {
          id: "kelas-2",
          title: { id: "Ruang Kelas — Sudut Papan" },
          image: "/demo/kelas-2.jpg",
          thumbnail: "/demo/kelas-2-thumb.jpg",
        },
      ],
      links: [
        {
          targetSceneId: "kelas-2",
          label: { id: "Lihat Sudut Papan" },
          yaw: 90,
          pitch: 0,
        },
        {
          targetSceneId: "kelas-1",
          label: { id: "Kembali ke Sudut Meja" },
          yaw: -90,
          pitch: 0,
        },
        {
          targetSceneId: "eksterior-1",
          label: { id: "Ke Eksterior" },
          yaw: 180,
          pitch: -5,
        },
        {
          targetSceneId: "asrama-1",
          label: { id: "Ke Asrama" },
          yaw: 20,
          pitch: 0,
        },
      ],
      photos: [
        {
          src: "/demo/photo-kelas-a.jpg",
          alt: { id: "Meja belajar di ruang kelas" },
        },
        {
          src: "/demo/photo-kelas-b.jpg",
          alt: { id: "Area aktivitas anak di kelas" },
        },
        {
          src: "/demo/photo-kelas-a.jpg",
          alt: { id: "Sudut tenang di ruang kelas" },
        },
      ],
      videos: [
        {
          id: "kelas-video-1",
          title: { id: "Suasana Belajar" },
          src: "/demo/video-sample.mp4",
          poster: "/demo/video-sample-poster.jpg",
        },
        {
          id: "kelas-video-2",
          title: { id: "Keliling Ruang Kelas" },
          src: "/demo/video-sample.mp4",
          poster: "/demo/video-sample-poster.jpg",
        },
      ],
    },
    {
      id: "taman-bermain",
      title: { id: "Taman Bermain" },
      shortDescription: {
        id: "Ruang terbuka untuk bermain, bergerak, dan tersenyum bersama.",
      },
      description: {
        id: "Taman bermain adalah jantung aktivitas luar ruang: ayunan, jalur sensorik, dan tempat duduk untuk pendamping. Area ini menghubungkan eksterior dengan kehidupan sehari-hari anak-anak.",
      },
      scenes: [
        {
          id: "taman-1",
          title: { id: "Taman Bermain" },
          image: "/demo/taman-1.jpg",
          thumbnail: "/demo/taman-1-thumb.jpg",
        },
      ],
      links: [
        {
          targetSceneId: "eksterior-1",
          label: { id: "Ke Eksterior" },
          yaw: -120,
          pitch: 0,
        },
        {
          targetSceneId: "asrama-1",
          label: { id: "Ke Asrama" },
          yaw: 70,
          pitch: -5,
        },
      ],
      photos: [
        {
          src: "/demo/photo-taman-a.jpg",
          alt: { id: "Area bermain outdoor" },
        },
        {
          src: "/demo/photo-taman-b.jpg",
          alt: { id: "Jalur sensorik di taman" },
        },
      ],
      videos: [
        {
          id: "taman-video-1",
          title: { id: "Bermain di Taman" },
          src: "/demo/video-sample.mp4",
          poster: "/demo/video-sample-poster.jpg",
        },
        {
          id: "taman-video-2",
          title: { id: "Suasana Sore di Taman" },
          src: "/demo/video-sample.mp4",
          poster: "/demo/video-sample-poster.jpg",
        },
      ],
    },
    {
      id: "asrama",
      title: { id: "Asrama" },
      shortDescription: {
        id: "Tempat istirahat yang hangat — rumah kedua bagi anak-anak.",
      },
      description: {
        id: "Asrama menyediakan kamar tidur bersama, ruang bersama, dan suasana yang tenang setelah hari penuh kegiatan. Dari sini Anda dapat kembali ke ruang kelas atau taman bermain.",
      },
      scenes: [
        {
          id: "asrama-1",
          title: { id: "Ruang Asrama" },
          image: "/demo/asrama-1.jpg",
          thumbnail: "/demo/asrama-1-thumb.jpg",
        },
      ],
      links: [
        {
          targetSceneId: "kelas-1",
          label: { id: "Ke Ruang Kelas" },
          yaw: -40,
          pitch: 0,
        },
        {
          targetSceneId: "taman-1",
          label: { id: "Ke Taman Bermain" },
          yaw: 100,
          pitch: -5,
        },
      ],
      photos: [
        {
          src: "/demo/photo-asrama-a.jpg",
          alt: { id: "Kamar tidur asrama" },
        },
        {
          src: "/demo/photo-asrama-b.jpg",
          alt: { id: "Ruang bersama di asrama" },
        },
      ],
      videos: [
        {
          id: "asrama-video-1",
          title: { id: "Kehidupan di Asrama" },
          src: "/demo/video-sample.mp4",
          poster: "/demo/video-sample-poster.jpg",
        },
        {
          id: "asrama-video-2",
          title: { id: "Sudut Tenang Asrama" },
          src: "/demo/video-sample.mp4",
          poster: "/demo/video-sample-poster.jpg",
        },
      ],
    },
  ],
};

export function t(value: { id: string; en?: string }, _locale: "id" | "en" = "id"): string {
  return value.id;
}

export function getAreaById(areaId: string) {
  return siteContent.areas.find((area) => area.id === areaId);
}

export function getSceneById(sceneId: string) {
  for (const area of siteContent.areas) {
    const scene = area.scenes.find((s) => s.id === sceneId);
    if (scene) {
      return { area, scene };
    }
  }
  return undefined;
}

export function getAreaForScene(sceneId: string) {
  return getSceneById(sceneId)?.area;
}

export function getAllScenes() {
  return siteContent.areas.flatMap((area) =>
    area.scenes.map((scene) => ({ area, scene })),
  );
}
