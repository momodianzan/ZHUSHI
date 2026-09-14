/* ============================================================
   中传筑时企业官网 - 主交互脚本
   ============================================================ */

(function () {
  "use strict";

  // ---------- DOM 加载完成后执行
  document.addEventListener("DOMContentLoaded", function () {
    initNavbar();
    initMobileMenu();
    initScrollAnimations();
    initCounterAnimation();
    initCaseFilter();
    initBackToTop();
    initContactForm();
    initSmoothScroll();
  });

  // ---------- 导航栏滚动效果 ----------
  function initNavbar() {
    const navbar = document.getElementById("navbar");
    if (!navbar) return;

    const heroHeight = window.innerHeight * 0.3;

    function handleScroll() {
      if (window.scrollY > heroHeight) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    }

    window.addEventListener("scroll", throttle(handleScroll, 100), { passive: true });
    handleScroll();
  }

  // ---------- 移动端菜单 ----------
  function initMobileMenu() {
    const toggle = document.getElementById("navToggle");
    const menu = document.getElementById("navMenu");
    if (!toggle || !menu) return;

    toggle.addEventListener("click", function () {
      toggle.classList.toggle("active");
      menu.classList.toggle("active");
    });

    // 点击菜单项后关闭
    const navLinks = menu.querySelectorAll(".nav-link");
    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        toggle.classList.remove("active");
        menu.classList.remove("active");
      });
    });
  }

  // ---------- 滚动入场动画 (IntersectionObserver) ----------
  function initScrollAnimations() {
    const elements = document.querySelectorAll(".fade-up");
    if (!elements.length) return;

    // 不支持 IntersectionObserver 时直接显示
    if (!("IntersectionObserver" in window)) {
      elements.forEach(function (el) {
        el.classList.add("visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
      }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  // ---------- 数字计数动画 ----------
  function initCounterAnimation() {
    const counters = document.querySelectorAll(".stat-number");
    if (!counters.length) return;

    if (!("IntersectionObserver" in window)) {
      counters.forEach(function (counter) {
        const target = parseInt(counter.getAttribute("data-target"), 10);
        counter.textContent = target;
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(function (counter) {
      observer.observe(counter);
    });

    function animateCounter(element) {
      const target = parseInt(element.getAttribute("data-target"), 10);
      const duration = 2000;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(easeProgress * target);
        element.textContent = current;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          element.textContent = target;
        }
      }

      requestAnimationFrame(update);
    }
  }

  // ---------- 案例筛选 ----------
  function initCaseFilter() {
    const filterBtns = document.querySelectorAll(".filter-btn");
    const caseItems = document.querySelectorAll(".case-item");
    if (!filterBtns.length || !caseItems.length) return;

    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filterBtns.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");

        const filter = btn.getAttribute("data-filter");

        caseItems.forEach(function (item) {
          const category = item.getAttribute("data-category");

          if (filter === "all" || category === filter) {
            item.classList.remove("hidden");
            item.style.opacity = "0";
            item.style.transform = "translateY(20px)";
            setTimeout(function () {
              item.style.transition = "opacity 0.5s ease, transform 0.5s ease";
              item.style.opacity = "1";
              item.style.transform = "translateY(0)";
            }, 50);
          } else {
            item.classList.add("hidden");
          }
        });
      });
    });
  }

  // ---------- 返回顶部 ----------
  function initBackToTop() {
    const btn = document.getElementById("backToTop");
    if (!btn) return;

    function handleScroll() {
      if (window.scrollY > 500) {
        btn.classList.add("visible");
      } else {
        btn.classList.remove("visible");
      }
    }

    window.addEventListener("scroll", throttle(handleScroll, 100), { passive: true });

    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ---------- 联系表单 ----------
  function initContactForm() {
    const form = document.getElementById("contactForm");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = form.querySelector("#name").value.trim();
      const phone = form.querySelector("#phone").value.trim();

      if (!name) { alert("请输入您的姓名"); return; }
      if (!phone) { alert("请输入联系电话"); return; }

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = "<span>提交成功！</span>";
      submitBtn.disabled = true;
      submitBtn.style.backgroundColor = "#4CAF50";
      submitBtn.style.borderColor = "#4CAF50";

      setTimeout(function () {
        form.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        submitBtn.style.backgroundColor = "";
        submitBtn.style.borderColor = "";
      }, 3000);
    });
  }

  // ---------- 平滑滚动锚点 ----------
  function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    if (!links.length) return;

    links.forEach(function (link) {
      link.addEventListener("click", function (e) {
        const targetId = link.getAttribute("href");
        if (targetId === "#" || targetId.length < 2) return;

        const targetEl = document.querySelector(targetId);
        if (!targetEl) return;

        e.preventDefault();

        const navHeight = 80;
        const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth"
        });
      });
    });
  }

  // ---------- 工具函数：节流 ----------
  function throttle(func, wait) {
    let timeout = null;
    let previous = 0;

    return function () {
      const now = Date.now();
      const args = arguments;
      const context = this;

      if (!previous) { previous = now; }

      const remaining = wait - (now - previous);

      if (remaining <= 0 || remaining > wait) {
        if (timeout) { clearTimeout(timeout); timeout = null; }
        previous = now;
        func.apply(context, args);
      } else if (!timeout) {
        timeout = setTimeout(function () {
          previous = Date.now();
          timeout = null;
          func.apply(context, args);
        }, remaining);
      }
    };
  }
})();
