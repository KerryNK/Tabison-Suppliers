import React, { useEffect } from "react";

const ONESIGNAL_APP_ID = "YOUR_ONESIGNAL_APP_ID"; // Replace with your OneSignal App ID

const PushNotifications: React.FC = () => {
  useEffect(() => {
    if (window && !(window as any).OneSignal) {
      const s = document.createElement("script");
      s.src = "https://cdn.onesignal.com/sdks/OneSignalSDK.js";
      s.async = true;
      document.body.appendChild(s);
      s.onload = () => {
        (window as any).OneSignal = (window as any).OneSignal || [];
        (window as any).OneSignal.push(function() {
          (window as any).OneSignal.init({
            appId: ONESIGNAL_APP_ID,
            notifyButton: { enable: true },
            allowLocalhostAsSecureOrigin: true
          });
        });
      };
    }
  }, []);
  return null;
};

export default PushNotifications;
