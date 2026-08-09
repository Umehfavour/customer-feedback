document.addEventListener('DOMContentLoaded', function () {
  var sidebar = document.querySelector('.sidebar');
  var backdrop = document.querySelector('.sidebar-backdrop');
  var toggle = document.querySelector('.menu-toggle');

  function openSidebar() {
    sidebar.classList.add('open');
    backdrop.classList.add('show');
  }
  function closeSidebar() {
    sidebar.classList.remove('open');
    backdrop.classList.remove('show');
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      if (sidebar.classList.contains('open')) closeSidebar();
      else openSidebar();
    });
  }
  if (backdrop) backdrop.addEventListener('click', closeSidebar);

  document.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', closeSidebar);
  });
});