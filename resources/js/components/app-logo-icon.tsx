import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg
            {...props}
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect width="40" height="40" rx="10" fill="#152844" />
            <path
                d="M26 14.5C24.5 13 22.5 12 20 12C15.0294 12 11 15.5817 11 20C11 24.4183 15.0294 28 20 28C22.5 28 24.5 27 26 25.5"
                stroke="#54d8ee"
                strokeWidth="3.5"
                strokeLinecap="round"
            />
            <circle cx="20" cy="20" r="3" fill="#0c43a3" />
        </svg>
    );
}
