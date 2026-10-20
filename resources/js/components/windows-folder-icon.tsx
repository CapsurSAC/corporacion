import { SvgIcon, type SvgIconProps } from '@mui/material';

export function WindowsFolderIcon(props: SvgIconProps) {
    return (
        <SvgIcon viewBox="0 0 48 48" {...props}>
            <path
                d="M6.5 13.5A4.5 4.5 0 0 1 11 9h9.2c1.2 0 2.3.5 3.1 1.4l2.2 2.5h11.5a5 5 0 0 1 5 5v1.6H6.5v-6Z"
                fill="currentColor"
                opacity="0.78"
            />
            <path
                d="M5 18.5h38v15.8a5.7 5.7 0 0 1-5.7 5.7H10.7A5.7 5.7 0 0 1 5 34.3V18.5Z"
                fill="currentColor"
            />
            <path
                d="M6.5 18.5h35"
                fill="none"
                stroke="white"
                strokeLinecap="round"
                strokeOpacity="0.22"
                strokeWidth="1.5"
            />
        </SvgIcon>
    );
}
