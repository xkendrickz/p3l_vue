//import vue router

import { createRouter, createWebHistory } from 'vue-router';
//define a routes
const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import('@/components/LoginPage.vue'),
  },
  {
    path: '/admin',
    name: 'admin.beranda',
    component: () => import('@/components/AdminDashboard.vue'),
    children: [
      {
        path: '/admin/instruktur',
        name: 'admin.instruktur.index',
        component: () => import('@/views/Admin/Instruktur/indexPage.vue'),
      },
      {
        path: 'admin/instruktur/create',
        name: 'admin.instruktur.create',
        component: () => import('@/views/Admin/Instruktur/createPage.vue'),
      },
      {
        path: 'admin/instruktur/edit',
        name: 'admin.instruktur.edit',
        component: () => import('@/views/Admin/Instruktur/editPage.vue'),
      },
    ],
  },
  {
    path: '/kasir',
    name: 'kasir.beranda',
    component: () => import('@/components/KasirDashboard.vue'),
    children: [
      {
        path: '/kasir/member',
        name: 'kasir.member.index',
        component: () => import('@/views/Kasir/Member/indexPage.vue'),
      },
      {
        path: '/kasir/member/create',
        name: 'kasir.member.create',
        component: () => import('@/views/Kasir/Member/createPage.vue'),
      },
      {
        path: '/kasir/member/edit',
        name: 'kasir.member.edit',
        component: () => import('@/views/Kasir/Member/editPage.vue'),
      },
      {
        path: '/kasir/aktivasi',
        name: 'kasir.aktivasi',
        component: () => import('@/views/Kasir/Transaksi/aktivasiPage.vue'),
      },
      {
        path: '/kasir/depositReguler',
        name: 'kasir.depositreguler',
        component: () => import('@/views/Kasir/Transaksi/depositRegulerPage.vue'),
      },
      {
        path: '/kasir/depositKelas',
        name: 'kasir.depositkelas',
        component: () => import('@/views/Kasir/Transaksi/depositKelasPage.vue'),
      },
      {
        path: '/kasir/reset',
        name: 'kasir.reset',
        component: () => import('@/views/Kasir/resetPage.vue'),
      },
      {
        path: '/kasir/presensi/gym',
        name: 'kasir.presensiGym',
        component: () => import('@/views/Kasir/Presensi/PresensiGym.vue'),
      },
      {
        path: '/kasir/presensi/kelas',
        name: 'kasir.presensiKelas',
        component: () => import('@/views/Kasir/Presensi/PresensiKelas.vue'),
      },
    ],
  },
  {
    path: '/mo',
    name: 'mo.beranda',
    component: () => import('@/components/MODashboard.vue'),
    children: [
      {
        path: '/mo/jadwalUmum',
        name: 'mo.jadwalUmum.index',
        component: () => import('@/views/manajerOperasional/JadwalUmum/indexPage.vue'),
      },
      {
        path: '/mo/jadwalUmum/create',
        name: 'mo.jadwalUmum.create',
        component: () => import('@/views/manajerOperasional/JadwalUmum/createPage.vue'),
      },
      {
        path: '/mo/jadwalUmum/edit',
        name: 'mo.jadwalUmum.edit',
        component: () => import('@/views/manajerOperasional/JadwalUmum/editPage.vue'),
      },
      {
        path: '/mo/jadwalHarian',
        name: 'mo.jadwalHarian.index',
        component: () => import('@/views/manajerOperasional/JadwalHarian/indexPage.vue'),
      },
      {
        path: '/mo/jadwalHarian/edit',
        name: 'mo.jadwalHarian.edit',
        component: () => import('@/views/manajerOperasional/JadwalHarian/editPage.vue'),
      },
      {
        path: '/mo/izin',
        name: 'mo.izin.index',
        component: () => import('@/views/manajerOperasional/Izin/indexPage.vue'),
      },
      {
        path: '/mo/laporan/pendapatan',
        name: 'mo.laporan.pendapatan',
        component: () => import('@/views/manajerOperasional/Laporan/laporanPendapatanPage.vue'),
      },
      {
        path: '/mo/laporan/aktivitasKelas',
        name: 'mo.laporan.aktivitasKelas',
        component: () => import('@/views/manajerOperasional/Laporan/laporanAktivitasKelasPage.vue'),
      },
      {
        path: '/mo/laporan/aktivitasGym',
        name: 'mo.laporan.aktivitasGym',
        component: () => import('@/views/manajerOperasional/Laporan/laporanAktivitasGymPage.vue'),
      },
      {
        path: '/mo/laporan/kinerja',
        name: 'mo.laporan.kinerja',
        component: () => import('@/views/manajerOperasional/Laporan/laporanKinerjaInstrukturPage.vue'),
      },
    ],
  },
];
//create router
const router = createRouter({
  history: createWebHistory(),
  routes, // config routes
});
export default router;
