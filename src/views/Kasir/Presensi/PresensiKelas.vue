<template>
	<div class="d-flex justify-content-between flex-wrap flex-mdnowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
		<h1 class="h2">PRESENSI KELAS</h1>
	</div>
	<div class="container mt-5">
		<div class="row">
			<div class="col-md-12">
				<div class="card border-0 rounded shadow">
					<div class="card-body">
						<table class="table table-striped table-bordered mt4">
							<thead class="thead-dark">
								<tr class="text-center">
									<th scope="col">NAMA KELAS</th>
									<th scope="col">NAMA INSTRUKTUR</th>
									<th scope="col">NAMA MEMBER</th>
									<th scope="col">TANGGAL</th>
									<th scope="col">JENIS</th>
									<th scope="col">STATUS</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(bookingKelas, id_presensi_kelas) in bookingKelas" :key="id_presensi_kelas"
									class="text-center">
									<td>{{ bookingKelas.nama_kelas }}</td>
									<td>{{ bookingKelas.nama_instruktur }}</td>
									<td>{{ bookingKelas.nama_member }}</td>
									<td>{{ bookingKelas.hari }}</td>
									<td>{{ bookingKelas.jenis }}</td>
									<td>{{ bookingKelas.status == 1 ? 'Hadir' : 'Tidak Hadir' }}</td>
									<td class="text-center">
										<button @click.prevent="presensiMember(bookingKelas.id_presensi_kelas)"
											class="btn btn-sm btn-primary ml-1 custom-btn">PRESENSI</button>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import axios from 'axios'
import { onMounted, ref, reactive } from 'vue'
import { useToast } from "vue-toastification";
export default {
	setup() {
		let bookingKelas = ref([])
		const presensis = reactive([]);

		// const token = localStorage.getItem('token')
		let toast = useToast();

		onMounted(() => {
			axios.get('https://gofit123.xyz/p3l_laravel/public/presensiKelas')
				.then(response => {
					bookingKelas.value = response.data.data
					console.log('response', bookingKelas.value);
				}).catch(error => {
					console.log(error.response.data.data);
				})
		})

		//method delete
		function presensiMember(id_presensi_kelas) {
			axios.get(`https://gofit123.xyz/p3l_laravel/public/cetakStruk/${id_presensi_kelas}`)
				.then((response) => {
					console.log(response)
					presensis.push(response.data.data);
					let data = response.data.data;

					if (presensis.length > 0 && data.jenis == 'Reguler') {
						const printContents = `
								<html>
								<head>
									<title>Struk Aktivasi</title>
									<style type="text/css">
									.card {
										width: 350px;
										height: 300px;
										padding: 20px;
										margin: 50px auto;
										outline: 2px solid black; /* replace "border" with "outline" */
										text-align: left;
									}
									</style>
								</head>
								<body>
									<div class="card">
										<h5 class="card-title"><strong>GoFit</strong></h5>
										<p>Jl. Centralpark No. 10 Yogyakarta</p>

										<h5 class="card-title"><strong>STRUK PRESENSI KELAS</strong></h5>
										${presensis.map((presensi) => `
											<p class="card-text">
												No Struk &emsp;&emsp;: ${presensi.no_struk}<br>
												Tanggal &emsp;&ensp;&emsp;: ${presensi.tanggal}<br><br>

												<strong>Member</strong> &emsp;&nbsp;: ${presensi.member_id} / ${presensi.nama_member}<br>
												Kelas &emsp;&emsp;&emsp;: ${presensi.nama_kelas}<br>
												Instruktur &emsp;&nbsp;: ${presensi.nama_instruktur}<br>
												Tariff &emsp;&emsp;&emsp;: ${presensi.tarif}<br>
												Sisa Deposit &nbsp;: ${presensi.sisa_deposit_reguler}<br>
											</p>
										`).join('')}
									</div>
								</body>									
								</html>`;
						const popup = window.open("", "_blank");
						popup.document.write(printContents);
						popup.document.close();
						popup.focus();
						popup.print();
						popup.close();
						presensis.length = 0
					} else if (presensis.length > 0 && data.jenis == 'Paket') {
						const printContents = `
								<html>
								<head>
									<title>Struk Aktivasi</title>
									<style type="text/css">
									.card {
										width: 350px;
										height: 300px;
										padding: 20px;
										margin: 50px auto;
										outline: 2px solid black; /* replace "border" with "outline" */
										text-align: left;
									}
									</style>
								</head>
								<body>
									<div class="card">
										<h5 class="card-title"><strong>GoFit</strong></h5>
										<p>Jl. Centralpark No. 10 Yogyakarta</p>

										<h5 class="card-title"><strong>STRUK PRESENSI KELAS</strong></h5>
										${presensis.map((presensi) => `
											<p class="card-text">
												No Struk &emsp;&emsp;&emsp;: ${presensi.no_struk}<br>
												Tanggal &emsp;&ensp;&emsp;&emsp;: ${presensi.tanggal}<br><br>

												<strong>Member</strong> &emsp;&ensp;&emsp;: ${presensi.member_id} / ${presensi.nama_member}<br>
												Kelas &emsp;&emsp;&emsp;&emsp;: ${presensi.nama_kelas}<br>
												Instruktur &emsp;&nbsp;&emsp;: ${presensi.nama_instruktur}<br>
												Sisa Deposit &nbsp;&emsp;: ${presensi.sisa_deposit_paket}x<br>
												Berlaku sampai &nbsp;: ${presensi.berlaku_sampai}<br>
											</p>
										`).join('')}
									</div>
								</body>									
								</html>`;
						const popup = window.open("", "_blank");
						popup.document.write(printContents);
						popup.document.close();
						popup.focus();
						popup.print();
						popup.close();
						presensis.length = 0
					}
				})
				.catch((error) => {
					console.log(error.response.data);
				});
			toast.success("Berhasil Register Instruktur !", {
				timeout: 2000
			})
			// window.location.reload();
		}
		// Check for the flag and show the toastification if it's set
		if (localStorage.getItem("showToast")) {
			toast.error("Berhasil Hapus BookingKelas !", {
				timeout: 2000
			});
			localStorage.removeItem("showToast"); // Remove the flag
		}

		return {
			bookingKelas,
			presensis,
			presensiMember,
		}
	}
}
</script>
<style>
.custom-text-field-width {
	width: 500px;
	/* example width */
}

.custom-btn {
	font-size: 12px;
	padding: 5px 5px;
}
</style>