// ==UserScript==
// @name         BJTU智慧平台验证码自动填写
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动获取并填写验证码
// @author       上条当咩
// @match        http://study.bjtu.top:88/ve/*
// @match        http://123.121.147.7:88/ve/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前域名
    function getCurrentDomain() {
        const currentURL = window.location.href;
        if (currentURL.includes('study.bjtu.top')) {
            return 'http://study.bjtu.top:88';
        } else if (currentURL.includes('123.121.147.7')) {
            return 'http://123.121.147.7:88';
        }
        return 'http://study.bjtu.top:88'; // 默认域名
    }

    // 定义获取验证码的函数
    function getVerificationCode() {
        const domain = getCurrentDomain();
        GM_xmlhttpRequest({
            method: 'GET',
            url: `${domain}/ve/confirmImg`,
            onload: function(response) {
                // 获取验证码文本
                const verificationCode = response.responseText;
                // 查找验证码输入框
                const inputField = document.querySelector('#passcode');
                // 如果找到输入框，填入验证码
                if (inputField) {
                    inputField.value = verificationCode;
                    // 触发input事件，确保其他可能的验证逻辑能正常运行
                    const event = new Event('input', {
                        bubbles: true,
                        cancelable: true,
                    });
                    inputField.dispatchEvent(event);
                }
            },
            onerror: function(error) {
                console.error('获取验证码失败:', error);
            }
        });
    }

    // 页面加载完成后执行
    window.addEventListener('load', function() {
        // 延迟一小段时间确保页面元素都已加载
        setTimeout(getVerificationCode, 500);
    });

    // 监听验证码刷新按钮点击事件（如果有的话）
    const refreshButton = document.querySelector('button[type="button"]'); // 根据实际刷新按钮的选择器修改
    if (refreshButton) {
        refreshButton.addEventListener('click', function() {
            setTimeout(getVerificationCode, 100);
        });
    }
})();