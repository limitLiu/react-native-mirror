extern crate rand;

use std::os::raw::c_char;
use std::ffi::{CString, CStr};
use rand::prelude::*;

#[no_mangle]
pub extern fn rust_greeting(to: *const c_char) -> *mut c_char {
    let c_str = unsafe { CStr::from_ptr(to) };
    let recipient = match c_str.to_str() {
        Err(_) => "there",
        Ok(string) => string,
    };
    CString::new("Hello ".to_owned() + recipient).unwrap().into_raw()
}

pub extern fn rust_rand_str() -> *mut c_char {
    let s: String = thread_rng().gen_ascii_chars().take(8).collect();
    CString::new(s).unwrap().into_raw()
}

#[no_mangle]
pub extern fn rust_greeting_free(s: *mut c_char) {
    unsafe {
        if s.is_null() { return; }
        CString::from_raw(s)
    };
}
