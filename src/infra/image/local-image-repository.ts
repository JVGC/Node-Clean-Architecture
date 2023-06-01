import { ImageRepository } from "../../domain/protocols/repositories/image-repository";

export class LocalImageRepository implements ImageRepository{
    async create(image: string, assetId: string): Promise<string> {
        return image
    }
}