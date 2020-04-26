package com.social.SocialApp.service;

import com.social.SocialApp.model.users;
import com.social.SocialApp.repository.UserRepository;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService  {
    @Autowired
    private UserRepository userRepository;

    public List<users> getAll() {
        return userRepository.findAll();
    }

    public void deleteAll() {
        userRepository.deleteAll();
    }
}
