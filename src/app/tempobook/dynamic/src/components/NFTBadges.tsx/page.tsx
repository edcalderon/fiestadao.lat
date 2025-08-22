import { useEffect } from 'react';
import { NFTBadges } from "./../../../../../../components/NFTBadges.tsx";


const args = {
};

const TempoComponent = () => {
  const notifyStoryRenderedArgs = () => {
    const notification = { filepath: '/home/peter/tempo-api/projects/91/fc/91fcfcba-5f3e-4eea-975c-678b7aa456d1/src/components/NFTBadges.tsx', componentName: 'NFTBadges', args };
    if (typeof window !== "undefined" && (window as any).notifyStoryRenderedArgs) {
      (window as any).notifyStoryRenderedArgs(notification);
    } else if (typeof window !== "undefined") {
      if (!Array.isArray((window as any).pendingStoryArgsNotifications)) {
        (window as any).pendingStoryArgsNotifications = [];
      }
      (window as any).pendingStoryArgsNotifications.push(notification);
    }
  }

  notifyStoryRenderedArgs();

  return <NFTBadges {...args}/>;
}



export default TempoComponent;