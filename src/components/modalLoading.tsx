import Lottie from 'react-lottie';
import loadingAnimation from '../../public/assets/lotties/loadingAnimation.json';

export function LoadingModal() {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: loadingAnimation,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice"
        }
      };
  
    return (
        <div className='w-full h-full flex items-center justify-center' >
        <Lottie 
            options={defaultOptions}
            height={400}
            width={400}
        />
        </div>
    );
}
