import { HomeService } from './home.service';
import { ProductsService } from '../products/products.service';
import { JwtService } from '@nestjs/jwt';
export declare class HomeController {
    private readonly homeService;
    private readonly productsService;
    private readonly jwtService;
    constructor(homeService: HomeService, productsService: ProductsService, jwtService: JwtService);
    listAllProduct(req: any, res: any): Promise<any>;
}
