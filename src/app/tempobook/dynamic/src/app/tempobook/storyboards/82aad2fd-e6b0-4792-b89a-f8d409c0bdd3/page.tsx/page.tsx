import { useEffect } from 'react';
import FiestaDAOStoryboard from "./../../../../../../../storyboards/82aad2fd-e6b0-4792-b89a-f8d409c0bdd3/page.tsx";


const args = {
};

const TempoComponent = () => {
  const notifyStoryRenderedArgs = () => {
    const notification = { filepath: '/home/peter/tempo-api/projects/91/fc/91fcfcba-5f3e-4eea-975c-678b7aa456d1/src/app/tempobook/storyboards/82aad2fd-e6b0-4792-b89a-f8d409c0bdd3/page.tsx', componentName: 'FiestaDAOStoryboard', args };
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

  return <FiestaDAOStoryboard {...args}/>;
}



export default TempoComponent;