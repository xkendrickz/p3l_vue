<template>
	<div class="container mt-5">
		<div class="row">
			<div class="col-md-12">
				<div class="card border-0 rounded shadow">
					<div class="card-body">
						<h4>EDIT JADWAL UMUM</h4>
						<hr />
						<form @submit.prevent="update">
							<div class="form-group mb-3">
								<label for="content" class="form-label">Tanggal</label>
								<select class="form-control" v-model="jadwalumum.hari">
									<option value="monday">Monday</option>
									<option value="tuesday">Tuesday</option>
									<option value="wednesday">Wednesday</option>
									<option value="thursday">Thursday</option>
									<option value="friday">Friday</option>
									<option value="saturday">Saturday</option>
									<option value="sunday">Sunday</option>
								</select>
								<div v-if="validation.hari" class="mt-2 alert alert-danger">
									{{ validation.hari[0] }}
								</div>
							</div>
							<div class="form-group mb-3">
								<label class="form-label">Jam</label>
								<input type="time" class="form-control" v-model="jadwalumum.jam"
									placeholder="Masukkan Jam" />
								<!-- validation -->
								<div v-if="validation.password" class="mt-2 alert alert-danger">
									{{ validation.password[0] }}
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
		const jadwalumum = reactive({
			hari: "",
			jam: "",
		});
		//state validation
		const validation = ref([]);
		//vue router
		const router = useRouter();
		//params id
		const route = useRoute();
		const id = route.params.id;

		onMounted(() => {
			//get API from Laravel Backend
			axios.get(`https://gofit123.xyz/p3l_laravel/public/jadwalUmum/${id}`)
				.then(response => {
					//assign state posts with response data
					console.log(response)
					jadwalumum.hari = response.data.data.hari
					jadwalumum.jam = response.data.data.jam
				}).catch(error => {
					console.log(error.response.data)
				})
		})

		//method update
		function update() {
			let hari = jadwalumum.hari;
			let jam = jadwalumum.jam;

			let toast = useToast();
			axios.put(`https://gofit123.xyz/p3l_laravel/public/jadwalUmum/${id}`, {
				hari: hari,
				jam: jam
			})
				.then(() => {
					toast.success("Berhasil Edit Data !", {
						timeout: 2000
					})
					// redirect ke post index
					router.push({
						name: "mo.jadwalUmum.index",
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
			jadwalumum,
			validation,
			router,
			update,
		};
	},
};
</script>

<style></style>
