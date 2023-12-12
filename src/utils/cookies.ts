export const getCookie = (name: string): string | null => {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim());
    const cookie = cookies.find(cookie => cookie.startsWith(name + '='));
    return cookie ? cookie.split('=')[1] : null;
};

export const removeCookie = (name: string): void => {
    const expires = new Date();
    expires.setTime(expires.getTime() - 1);

    document.cookie = `${name}=; expires=${expires.toUTCString()}; path=/;`;
}