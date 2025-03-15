package org.oskarsawicki.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "index";
    }
    @GetMapping("/index")
    public String indexAlt() {
        return "index";
    }

    @GetMapping("/info")
    public String info() {
        return "info";
    }
    @GetMapping("/list")
    public String list() {
        return "list";
    }
}
