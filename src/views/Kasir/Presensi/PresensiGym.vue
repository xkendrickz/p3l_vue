<template>
	<div class="d-flex justify-content-between flex-wrap flex-mdnowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
		<h1 class="h2">PRESENSI GYM</h1>
	</div>
	<div class="container mt-5">
		<div class="row">
			<div class="col-md-12">
				<div class="card border-0 rounded shadow">
					<div class="card-body">
						<table class="table table-striped table-bordered mt4">
							<thead class="thead-dark">
								<tr class="text-center">
									<th scope="col">NAMA MEMBER</th>
									<th scope="col">TANGGAL</th>
									<th scope="col">SLOT WAKTU</th>
									<th scope="col">STATUS</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(bookingGym, id_booking_gym) in bookingGym" :key="id_booking_gym"
									class="text-center">
									<td>{{ bookingGym.nama_member }}</td>
									<td>{{ bookingGym.tanggal }}</td>
									<td>{{ bookingGym.slot_waktu }}</td>
									<td>{{ bookingGym.status == 1 ? 'Hadir' : 'Tidak Hadir' }}</td>
									<td class="text-center">
										<button @click.prevent="presensiMember(bookingGym.id_booking_gym)"
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
		let bookingGym = ref([])
		const presensis = reactive([]);

		// const token = localStorage.getItem('token')
		let toast = useToast();

		onMounted(() => {
			axios.get('http://10.53.11.139:8000/api/presensiGym')
				.then(response => {
					bookingGym.value = response.data.data
					console.log('response', bookingGym.value);
				}).catch(error => {
					console.log(error.response.data.data);
				})
		})

		//method delete
		function presensiMember(id_booking_gym) {
			axios.put(`http://10.53.11.139:8000/api/presensiGym/${id_booking_gym}`)
				.then((response) => {
					console.log(response)
					let id_presensi_gym = response.data.data.id_presensi_gym;
					axios.get(`http://10.53.11.139:8000/api/presensiGym/${id_presensi_gym}`)
						.then((response) => {
							console.log(response)
							presensis.push(response.data.data);
							if (presensis.length > 0) {
								console.log(presensis)
								const printContents = `
									<html>
									<head>
										<title>Struk Aktivasi</title>
										<style type="text/css">
										.card {
											width: 300px;
											height: 225px;
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

											<h5 class="card-title"><strong>STRUK PRESENSI GYM</strong></h5>
											${presensis.map((presensi) => `
												<p class="card-text">
													No Struk &emsp;: ${presensi.no_struk}<br>
													Tanggal &emsp;&ensp;: ${presensi.tanggal}<br><br>
													<strong>Member</strong> &emsp;&nbsp;: ${presensi.member_id} / ${presensi.nama_member}<br>
													Slot Waktu &nbsp;: ${presensi.slot_waktu}<br>
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
				}).catch(error => {
					console.log(error.response.data)
				})
		}
		// Check for the flag and show the toastification if it's set
		if (localStorage.getItem("showToast")) {
			toast.error("Berhasil Hapus BookingGym !", {
				timeout: 2000
			});
			localStorage.removeItem("showToast"); // Remove the flag
		}

		return {
			bookingGym,
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