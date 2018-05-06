//
//  RustManage.m
//  Awesome
//
//  Created by liuyu on 2018/5/6.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "RustManage.h"
#import "abi_test.h"

@implementation RustManage

RCT_EXPORT_MODULE();

RCT_REMAP_METHOD(plus,
                 count: (NSInteger)count
                 reslover:(RCTPromiseResolveBlock)resolve
                 rejecter: (RCTPromiseRejectBlock)reject) {
  if (count > -1) {
    resolve(@(plus(count)));
  } else {
    reject(@"error", @"no count", nil);
  }
}

@end
