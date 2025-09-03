export function layMaTruyXuatTuUrl(url: string) {
    const indexGachCheoCuoi : number = url.lastIndexOf('/');
    const maTruyXuat = url.substring(indexGachCheoCuoi + 1);

    return maTruyXuat;
}