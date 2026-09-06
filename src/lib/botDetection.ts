/**
 * Helper to detect search engine crawlers and testing bots.
 * Google Search Console's live testing tool specifically uses "Google-InspectionTool",
 * while crawlers use "Googlebot", "bingbot", etc.
 */
export const isSearchBot = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  return /bot|crawler|spider|googlebot|bingbot|google-inspectiontool|inspectiontool|headlesschrome/i.test(navigator.userAgent);
};
