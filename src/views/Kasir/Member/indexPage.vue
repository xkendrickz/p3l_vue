<template>
	<div class="d-flex justify-content-between flex-wrap flex-mdnowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
		<h1 class="h2">LIST MEMBER</h1>
	</div>
	<div class="container mt-5">
		<div class="row">
			<div class="col-md-12">
				<div class="card border-0 rounded shadow">
					<div class="card-body">
						<router-link :to="{ name: 'kasir.member.create' }" class="btn btn-md btn-success mb-4">New
							Member</router-link>
						&nbsp;
						<v-text-field v-model="searchText" prepend-inner-icon="mdi-magnify" label="Cari Nama Member"
							placeholder="Enter Member Name" class="custom-text-field-width"></v-text-field>
						<table class="table table-striped table-bordered mt4">
							<thead class="thead-dark">
								<tr class="text-center">
									<th scope="col">ID MEMBER</th>
									<th scope="col">NAMA MEMBER</th>
									<th scope="col">STATUS</th>
									<th scope="col">ALAMAT</th>
									<th scope="col">TELEPON</th>
									<th scope="col">TANGGAL LAHIR</th>
									<th scope="col">EMAIL</th>
									<th scope="col">TANGGAL PENDAFTARAN</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(member, id_member) in filteredMember" :key="id_member" class="text-center">
									<td>{{ member.member_id }}</td>
									<td>{{ member.nama_member }}</td>
									<td>{{ member.status == 1 ? 'Aktif' : 'Tidak Aktif' }}</td>
									<td>{{ member.alamat }}</td>
									<td>{{ member.telepon }}</td>
									<td>{{ member.tanggal_lahir }}</td>
									<td>{{ member.email }}</td>
									<td>{{ member.tanggal_daftar }}</td>
									<td class="text-center">
										<router-link :to="{
											name: 'kasir.member.edit', params: {
												id_member: member.id_member,
												Tanggal_lahir: member.Tanggal_lahir
											}
										}" class="btn btn-sm btn-primary mr-1 custom-btn"><v-icon size="15">mdi-pencil</v-icon>EDIT</router-link>
										&nbsp;
										<button @click.prevent="MemberDelete(member.id_member)"
											class="btn btn-sm btn-danger ml-1 custom-btn"><v-icon
												size="15">mdi-trash-can-outline</v-icon>DELETE</button>

										<button @click.prevent="generatePDF(member.id_member)"
											class="btn btn-sm btn-primary mr-1">Membercard</button>
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
		let member = ref([])
		const members = reactive([]);

		// const token = localStorage.getItem('token')
		let toast = useToast();
		const searchText = ref('');
		const filteredMember = computed(() => {
			return member.value.filter(member => {
				return member.nama_member.toLowerCase().includes(searchText.value.toLowerCase())
			})
		})

		onMounted(() => {
			axios.get('http://localhost:8000/api/member')
				.then(response => {
					member.value = response.data.data
					console.log('response', member.value);
				}).catch(error => {
					console.log(error.response.data.data);
				})
		})

		//method delete
		function MemberDelete(id_member) {
			axios.delete(`http://192.168.100.111/p3l/gopit_backend/public/member/${id_member}`)
				.then(() => {
					toast.error("Berhasil Hapus Member !", {
						timeout: 2000
					})
					member.value.splice(member.value.indexOf(id_member), 1);
					localStorage.setItem("showToast", "true"); // Set flag to show toast
					window.location.reload();
				}).catch(error => {
					console.log(error.response.data)
				})
		}
		// Check for the flag and show the toastification if it's set
		if (localStorage.getItem("showToast")) {
			toast.error("Berhasil Hapus Member !", {
				timeout: 2000
			});
			localStorage.removeItem("showToast"); // Remove the flag
		}

		function generatePDF(id_member) {
			axios.get(`http://localhost:8000/api/member/${id_member}`)
				.then((response) => {
					members.push(response.data.data);
					if (members.length > 0) {
						const printContents = `
							<html>
							<head>
								<title>Member Card</title>
								<style type="text/css">
									.card {
										width: 300px;
										height: 200px;
										padding: 20px;
										margin: 50px auto;
										border: 2px solid black;
										text-align: left;
									}
								</style>
							</head>
							<body>
								<div class="card">
									<h5 class="card-title"><strong>GoFit</strong></h5>
									<p>Jl. Qlipoth Tree No 5 Yogyakarta</p>

									<h5 class="card-title"><strong>MEMBER CARD</strong></h5>
									${members.map((member) => `
										<p class="card-text">
											Member ID : ${member.member_id}<br>
											Nama : ${member.nama_member}<br>
											Alamat : ${member.alamat}<br>
											Telpon : ${member.telepon}<br>
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
						members.length = 0
					}
				})
				.catch((error) => {
					console.log(error.response.data);
				});
		}

		return {
			member,
			members,
			MemberDelete,
			filteredMember,
			searchText,
			generatePDF,
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