<template>
	<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
		<h1 class="h2">LIST EXPIRED</h1>
	</div>
	<div class="container mt-5">
		<div class="row">
			<div class="col-md-12">
				<div class="card border-0 rounded shadow">
					<div class="card-body">
						<div class="row">
							<div class="d-flex justify-content-center mb-2">
								<button @click.prevent="resetInstruktur()" class="btn btn-sm btn-danger mr-1">Reset
									Terlambat Instruktur</button>
							</div>
							<div class="d-flex justify-content-center mb-2">
								<button @click.prevent="resetMember()" class="btn btn-sm btn-danger mr-1">Deaktivasi Member
									dan Reset Deposit Paket</button>
							</div>
							<div class="col-md-6">
								<h3 class="text-center">Membercard Expired</h3>
								<table class="table table-striped table-bordered mt4">
									<thead class="thead-dark">
										<tr class="text-center">
											<th scope="col">NAMA MEMBER</th>
											<th scope="col">TANGGAL KADALUARSA</th>
										</tr>
									</thead>
									<tbody>
										<tr v-for="(aktivasi, memberAktivasi) in aktivasi" :key="memberAktivasi"
											class="text-center">
											<td>{{ aktivasi.memberAktivasi }}</td>
											<td>{{ aktivasi.masa_aktif }}</td>
										</tr>
									</tbody>
								</table>
							</div>
							<div class="col-md-6">
								<h3 class="text-center">Deposit Paket Expired</h3>
								<table class="table table-striped table-bordered mt4">
									<thead class="thead-dark">
										<tr class="text-center">
											<th scope="col">NAMA MEMBER</th>
											<th scope="col">TANGGAL KADALUARSA</th>
										</tr>
									</thead>
									<tbody>
										<tr v-for="(deposit, memberDeposit) in deposit" :key="memberDeposit"
											class="text-center">
											<td>{{ deposit.memberDeposit }}</td>
											<td>{{ deposit.berlaku_sampai }}</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { useToast } from "vue-toastification";
export default {
	setup() {
		let aktivasi = ref([])
		let deposit = ref([])

		// const token = localStorage.getItem('token')
		let toast = useToast();

		onMounted(() => {
			axios.get('http://localhost:8000/api/indexAktivasi')
				.then(response => {
					aktivasi.value = response.data.data
				}).catch(error => {
					console.log(error.response.data.data);
				})
		})

		onMounted(() => {
			axios.get('http://localhost:8000/api/indexDeposit')
				.then(response => {
					deposit.value = response.data.data
				}).catch(error => {
					console.log(error.response.data.data);
				})
		})

		function resetMember() {
			axios.post(`http://localhost:8000/api/resetMember`)
				.then(() => {
					toast.success("Berhasil Reset Status Member dan Sisa Deposit Paket!", {
						timeout: 2000
					})
				})
				.catch((error) => {
					console.log(error.response.data);
				});
		}

		function resetInstruktur() {
			axios.post(`http://localhost:8000/api/resetInstruktur`)
				.then(() => {
					toast.success("Berhasil Reset Waktu Terlambat Instruktur !", {
						timeout: 2000
					})
				})
				.catch((error) => {
					console.log(error.response.data);
				});
		}

		// Check for the flag and show the toastification if it's set
		if (localStorage.getItem("showToast")) {
			toast.error("Berhasil Hapus Member !", {
				timeout: 2000
			});
			localStorage.removeItem("showToast"); // Remove the flag
		}

		return {
			aktivasi,
			deposit,
			resetMember,
			resetInstruktur
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