<template>
	<div class="d-flex justify-content-between flex-wrap flex-mdnowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
		<h1 class="h2">LIST IZIN</h1>
	</div>
	<div class="container mt-5">
		<div class="row">
			<div class="col-md-12">
				<div class="card border-0 rounded shadow">
					<div class="card-body">
						<h3 class="text-center">Confirmed Izin</h3>
						<table class="table table-striped table-bordered mt4">
							<thead class="thead-dark">
								<tr class="text-center">
									<th scope="col">NAMA INSTRUKTUR</th>
									<th scope="col">DETAIL IZIN</th>
									<th scope="col">TANGGAL</th>
									<th scope="col">STATUS</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(izin, id_izin) in konfirmasi" :key="id_izin" class="text-center">
									<td>{{ izin.nama_instruktur }}</td>
									<td>{{ izin.detail_izin }}</td>
									<td>{{ izin.tanggal_izin }}</td>
									<td>{{ izin.konfirmasi == 1 ? 'Dikonfirmasi' : 'Belum Dikonfirmasi' }}</td>
								</tr>
							</tbody>
						</table>

						<h3 class="text-center">Unconfirmed Izin</h3>
						<table class="table table-striped table-bordered mt4">
							<thead class="thead-dark">
								<tr class="text-center">
									<th scope="col">NAMA INSTRUKTUR</th>
									<th scope="col">DETAIL IZIN</th>
									<th scope="col">TANGGAL</th>
									<th scope="col">STATUS</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(izin, id_izin) in tidakkonfirmasi" :key="id_izin" class="text-center">
									<td>{{ izin.nama_instruktur }}</td>
									<td>{{ izin.detail_izin }}</td>
									<td>{{ izin.tanggal_izin }}</td>
									<td>{{ izin.konfirmasi == 1 ? 'Dikonfirmasi' : 'Belum Dikonfirmasi' }}</td>
									<td class="text-center">
										<button @click.prevent="KonfirmasiIzin(izin.id_izin)"
											class="btn btn-sm btn-primary ml-1 custom-btn">KONFIRMASI</button>
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
import { onMounted, ref, computed, reactive } from 'vue'
import { useToast } from "vue-toastification";
export default {
	setup() {
		let izin = ref([])
		const izins = reactive([]);

		// const token = localStorage.getItem('token')
		let toast = useToast();
		const konfirmasi = computed(() => {
			return izin.value.filter((izin) => izin.konfirmasi === 1)
		})

		const tidakkonfirmasi = computed(() => {
			return izin.value.filter((izin) => izin.konfirmasi === 0)
		})


		onMounted(() => {
			axios.get('https://gofit123.xyz/p3l_laravel/public/izin')
				.then(response => {
					izin.value = response.data.data
					console.log('response', izin.value);
				}).catch(error => {
					console.log(error.response.data.data);
				})
		})

		onMounted(() => {
			axios.get('https://gofit123.xyz/p3l_laravel/public/izin')
				.then(response => {
					izin.value = response.data.data
					console.log('response', izin.value);
				}).catch(error => {
					console.log(error.response.data.data);
				})
		})

		//method delete
		function KonfirmasiIzin(id_izin) {
			axios.put(`https://gofit123.xyz/p3l_laravel/public/izin/${id_izin}`)
				.then(() => {
					toast.error("Berhasil Hapus Izin !", {
						timeout: 2000
					})
					localStorage.setItem("showToast", "true"); // Set flag to show toast
					window.location.reload();
				}).catch(error => {
					console.log(error.response.data)
				})
		}
		// Check for the flag and show the toastification if it's set
		if (localStorage.getItem("showToast")) {
			toast.error("Berhasil Hapus Izin !", {
				timeout: 2000
			});
			localStorage.removeItem("showToast"); // Remove the flag
		}

		return {
			izin,
			izins,
			KonfirmasiIzin,
			konfirmasi,
			tidakkonfirmasi,
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