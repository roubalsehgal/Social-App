package com.social.SocialApp.controller;
import com.social.SocialApp.model.users;
import com.social.SocialApp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Iterator;
import java.util.List;

@CrossOrigin("*")
@RestController
public class UserController {

    @Autowired
    private UserService userService;
    private PasswordEncoder passwordEncoder;

    public UserController(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @RequestMapping(method = RequestMethod.POST,value = "/userLogin")
    public users getAllPerson(@RequestBody users reqUser) {
        String userEmail =  reqUser.getEmail();
        String userPassword = reqUser.getPassword();
        System.out.println("Hello world");
       List<users> userDB = userService.getAll();
        for (users user : userDB) {
            if (user.getEmail().equals(userEmail)) {
                if(passwordEncoder.matches(userPassword,user.getPassword())) {
                    return user;
                }
            }
        }
        return null;
    }

    @RequestMapping("/deleteAll")
    public String deleteAll() {
        userService.deleteAll();
        return "Deleted All Records!";
    }

}
