import { useEffect } from 'react';

export default function Login() {
    useEffect(() => {
        window.location.replace('/?login=1');
    }, []);

    return null;
}
