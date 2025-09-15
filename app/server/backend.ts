const domain = 'http://192.168.1.15:5000';

export function url(route: string) {
    return domain + '/' + route;
}