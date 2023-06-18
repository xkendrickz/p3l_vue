<template>
	<div class="container mt-5">
		<div class="row">
			<div class="col-md-12">
				<div class="card border-0 rounded shadow">
					<div class="card-body">
						<h4>EDIT JADWAL HARIAN</h4>
						<hr />
						<form @submit.prevent="update">
							<div class="form-group mb-3">
								<label class="form-label">Status</label>
								<select class="form-control" v-model="jadwal_harian.nama_kelas">
									<option value="" selected hidden disabled>Pilih Kelas</option>
									<option value="Libur">Libur</option>
									<option value="Digantikan">Digantikan</option>
								</select>
								<!-- validation -->
								<div v-if="validation.umur" class="mt-2 alert alert-danger">
									{{ validation.umur[0] }}
								</div>
							</div>
							<button type="submit" class="btn btn-primary">SIMPAN</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { reactive, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";
import { useToast } from "vue-toastification";
export default {
	setup() {
		//state product
		const jadwal_harian = reactive({
			status: "",
		});
		//state validation
		const validation = ref([]);
		//vue router
		const router = useRouter();
		//params id
		const route = useRoute();
		const id = route.params.id;

		onMounted(() => {

			axios.get(`https://gofit123.xyz/p3l_laravel/public/jadwalHarian/${id}`)
				.then(response => {
					console.log(response.data)
					jadwal_harian.status = response.data.data[0].status
				}).catch(error => {
					console.log(error.response.data.data);
				})
		})

		//method update
		function update() {
			let status = jadwal_harian.status;

			let toast = useToast();
			axios.put(`https://gofit123.xyz/p3l_laravel/public/jadwalHarian/${id}`, {
				status: status
			})
				.then(() => {
					toast.success("Berhasil Edit Data !", {
						timeout: 2000
					})
					// redirect ke post index
					router.push({
						name: "mo.jadwalHarian.index",
					});
				})
				.catch((error) => {
					console.log(error.response.data)
					//assign state validation with error
					validation.value = error.response.data;
				});
		}
		//return
		return {
			jadwal_harian,
			validation,
			router,
			update,
		};
	},
};
</script>

<style></style>
