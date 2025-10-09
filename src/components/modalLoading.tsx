import Lottie from "lottie-react";
import loadingAnimation from "../assets/lotties/loadingAnimation.json";

export function LoadingModal() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Lottie
        animationData={loadingAnimation}
        loop={true}
        autoplay={true}
        style={{ height: 400, width: 400 }}
      />
    </div>
  );
}
