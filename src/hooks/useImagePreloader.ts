import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";

import headerLogo from "@/assets/header-logo.png";
import headerIcon from "@/assets/header-icon.png";
import anNurLogo from "@/assets/an-nur-digital-logo.png";
import quranInsightLogo from "@/assets/quran-insight-logo.png";

const STATIC_ASSETS = [headerLogo, headerIcon, anNurLogo, quranInsightLogo];
const MAX_WAIT_MS = 8000;

function collectImageUrls(queryClient: ReturnType<typeof useQueryClient>): string[] {
  const urls = new Set<string>(STATIC_ASSETS);

  // Profile photo
  const profile = queryClient.getQueryData<any>(["profile"]);
  if (profile?.photo_url) urls.add(profile.photo_url);

  // Projects
  const projects = queryClient.getQueryData<any[]>(["projects"]) ?? [];
  for (const p of projects) {
    if (p.image_url) urls.add(p.image_url);
    if (Array.isArray(p.gallery_images)) {
      for (const img of p.gallery_images) if (img) urls.add(img);
    }
  }

  // Blog posts
  const posts = queryClient.getQueryData<any[]>(["blog_posts"]) ?? [];
  for (const post of posts) {
    if (post.cover_image_url) urls.add(post.cover_image_url);
    if (Array.isArray(post.gallery_images)) {
      for (const img of post.gallery_images) if (img) urls.add(img);
    }
  }

  return Array.from(urls).filter(Boolean);
}

export function useImagePreloader() {
  const queryClient = useQueryClient();
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    // Wait a tick for prefetch queries to populate cache
    const waitForData = setInterval(() => {
      const profile = queryClient.getQueryData(["profile"]);
      const projects = queryClient.getQueryData(["projects"]);
      if (profile !== undefined && projects !== undefined) {
        clearInterval(waitForData);
        startPreloading();
      }
    }, 100);

    // Safety: don't wait for data forever
    const dataTimeout = setTimeout(() => {
      clearInterval(waitForData);
      startPreloading();
    }, 3000);

    function startPreloading() {
      clearTimeout(dataTimeout);
      const urls = collectImageUrls(queryClient);

      if (urls.length === 0) {
        setProgress(100);
        setReady(true);
        return;
      }

      let loaded = 0;
      const total = urls.length;

      const maxWait = setTimeout(() => {
        setProgress(100);
        setReady(true);
      }, MAX_WAIT_MS);

      for (const url of urls) {
        const img = new Image();
        img.src = url;
        const done = () => {
          loaded++;
          const pct = Math.round((loaded / total) * 100);
          setProgress(pct);
          if (loaded >= total) {
            clearTimeout(maxWait);
            setReady(true);
          }
        };
        img.onload = done;
        img.onerror = done;
      }
    }

    return () => {
      clearInterval(waitForData);
      clearTimeout(dataTimeout);
    };
  }, [queryClient]);

  return { ready, progress };
}
