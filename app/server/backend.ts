const domain = 'http://192.168.1.12:5000';

export function url(route: string) : string {
    return domain + '/' + route;
}