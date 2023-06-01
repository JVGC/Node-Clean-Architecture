export interface ImageRepository{
    create(image: string, assetId: string): Promise<string>;
}