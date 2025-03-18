package org.oskarsawicki.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "intro";
    }
    @GetMapping("/preview")
    public String indexAlt() {
        return "index";
    }

    @GetMapping("/info")
    public String info() {
        return "info";
    }
    @GetMapping("/gallery-index")
    public String list() {
        return "list";
    }
}
