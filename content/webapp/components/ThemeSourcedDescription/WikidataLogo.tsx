import { SVGProps } from 'react';

function WikidataLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 50 50" {...props}>
      <g fill="none">
        <path
          fill="#900"
          d="M0 40.767h1.795V10H0v30.767zm3.71 0h5.502V10H3.71v30.767zM11.006 10v30.766h5.504V10h-5.504z"
        />
        <path
          fill="#396"
          d="M44.28 40.77h1.796V10H44.28v30.77zM47.99 10v30.77h1.795V10H47.99zM18.365 40.77h1.795V10h-1.795v30.77zM22.075 10v30.768h1.795V10h-1.795z"
        />
        <path
          fill="#069"
          d="M25.723 40.77h5.504V10h-5.504v30.77zm7.299 0h1.914V10h-1.914v30.77zM36.73 10v30.768h5.503V10H36.73z"
        />
      </g>
    </svg>
  );
}

export default WikidataLogo;
