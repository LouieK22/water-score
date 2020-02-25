<template lang="pug">
	section
		section(v-bind:class="{ hero: true, 'is-primary': typeof timer === 'number', 'is-danger': stopped}")
			.hero-body
				.container
					h1(class="title") {{gameStateText}}
					.buttons
						button(class="button is-success" v-on:click="manageTimer") Start
						button(class="button is-warning" v-on:click="manageTimer") Pause
						button(class="button is-dark" v-on:click="manageTimer") Reset

		.columns
			.column
				Team(side = "Left")
			.column
				Team(side = "Right")
</template>

<script lang="ts">
import Vue from "vue";
import EventBus from "./EventBus";

import Team from "./Team.vue";

interface IData {
	gameStateText: string,
	timer: number | null,
	timerStartTime: number,
	timeLeft: number,
	paused: boolean,
	stopped: boolean,
}

export default Vue.extend({
	components: {
		Team
	},
	data() {
		const data: IData = {
			gameStateText: "03:00",
			timer: null,
			timerStartTime: (3 * 60),
			timeLeft: (3 * 60),
			paused: false,
			stopped: false,
		};

		return data;
	},
	methods: {
		updateTimerDisplay: function() {
			const dateObj = new Date(this.timeLeft * 1000);
			const minutes = dateObj.getUTCMinutes();
			const seconds = dateObj.getSeconds();

			this.gameStateText = minutes.toString().padStart(2, "0") + ":" +
				seconds.toString().padStart(2, "0");
		},
		resetTimer: function() {
			if(this.timer){
				clearInterval(this.timer);
			}

			this.stopped = false;
			this.timeLeft = this.timerStartTime;
			this.timer = null;
			this.paused = false;
			this.updateTimerDisplay();
			EventBus.$emit("reset");
		},
		manageTimer: function(event: Event) {
			if(event.target){
				const target = event.target as HTMLButtonElement;

				switch (target.textContent) {
				case "Start":
					if(this.paused){
						this.timer = setInterval(() => this.tickTimer(), 1000);
						this.paused = false;
						break;
					}

					if(this.timer){
						break;
					}

					this.timer = setInterval(() => this.tickTimer(), 1000);

					this.updateTimerDisplay();

					EventBus.$emit("start");

					break;

				case "Pause":
					if(this.timer){
						clearInterval(this.timer);
						this.paused = true;
						EventBus.$emit("pause");
					}

					this.updateTimerDisplay();

					break;

				case "Reset":

					this.resetTimer();

					break;

				default:
					break;
				}
			}
		},
		tickTimer: function() {
			this.timeLeft--;

			EventBus.$emit("tick");

			this.updateTimerDisplay();

			if(this.timeLeft <= 0 && this.timer){
				clearInterval(this.timer);
				this.stopped = true;
			}
		}
	}
});
</script>
