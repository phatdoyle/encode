import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ethers } from 'ethers';
import { AppService, CreatePaymentOrderDto, PaymentOrder, RequestPaymentOrderDto } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}


  @Get('last-block')
  getLastBlock(): Promise<ethers.providers.Block> {
    return this.appService.getBlock();
  }

  @Get('block/:hash')
  getBlock(@Param('hash') hash:string): Promise<ethers.providers.Block> {
    return this.appService.getBlock(hash);
  }

  @Get('total-supply/:address')
  getTotalSupply(@Param('address') address:string): Promise<number> {
    return this.appService.getTotalSupply(address);
  }

  @Get('allowance/:address/:from/:to')
  getAllowance(@Query('address') address:string,@Query('from') from :string, @Query('to') to:string ): Promise<number> {
    return this.appService.getTotalSupply(address);
  }

  @Get('payment-order/:id')
  getPaymentOrder(@Param('id') id:number): any {
    return this.appService.getPaymentOrder(id);
  }

  @Post("payment-order")
  createPaymentOrder(@Body() body: CreatePaymentOrderDto):number{
    return this.appService.createPaymentOrder(body.value, body.secret)
  }

  @Post('request-payment')
  requestPaymentOrder(@Body() body: RequestPaymentOrderDto): Promise<any>{
    return this.appService.requestPaymentOrder(body.id, body.secret, body.receiver)
  }

  @Post('request-tokens')
  requestTokens(){
    
  }

  @Get("token-address")
  getTokenAddress(){
    return {result: this.appService.getTokenContract()}
  }
}