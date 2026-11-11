"use client";

import { FacilityGallery } from "./facility-gallery";
import { useFacilitiesViewModel } from "../facilities.hooks";

export function FacilitiesSection({ limit }: { limit?: number }) {
  const { facilities } = useFacilitiesViewModel();
  const visible = limit ? facilities.slice(0, limit) : facilities;

  return <FacilityGallery facilities={visible} />;
}
