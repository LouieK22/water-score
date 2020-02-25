<template lang="pug">
	section
		p(class="title") {{side}} Team: {{score}}
		p(class="subtitle")
		section
			section
				h3(class="title is-4") Waterbottle Scoring (P1)
				.level
					button(class="level-item button is-info" v-on:click="waterScore = waterScore + 5") Add Laying
					button(class="level-item button is-info" v-on:click="waterScore = waterScore + 10") Add Standing
					.control
						input(class="input" type="text" v-bind:value="waterScore" readonly)
					button(class="level-item button is-danger" v-on:click="waterScore = waterScore - 10") Remove Standing
					button(class="level-item button is-danger" v-on:click="waterScore = waterScore - 5") Removing Laying
			section
				h3(class="title is-4") Bottle Tipping (G3)
				.level
					button(class="level-item button is-info" v-on:click="bottleTippingPenalty = bottleTippingPenalty + (isViolatingHome ? 20 : 5)") Add Penalty
					.control
						input(class="input" type="text" v-bind:value="bottleTippingPenalty" readonly)
					button(class="level-item button is-danger" v-on:click="bottleTippingPenalty = bottleTippingPenalty - 5") Remove Penalty
			section
				h3(class="title is-4") Home Violation (G1)
				.level
					button(class="level-item button is-info" v-on:click="isViolatingHome = true") Start
					.control
						input(class="input" type="text" v-bind:value="homeViolationCounter" readonly)
					button(class="level-item button is-danger" v-on:click="isViolatingHome = false") Stop
			section
				h3(class="title is-4") Multi-Bottle Violation (G5)
				.level
					button(class="level-item button is-info" v-on:click="isViolatingMultiBottle = true") Start
					.control
						input(class="input" type="text" v-bind:value="'Total: ' + totalMultiBottleViolationCounter + ' Current: ' + currentMultiBottleViolationCounter" readonly)
					button(class="level-item button is-danger" v-on:click="stopMultiBottleViolationCounter") Stop
			section
				h3(class="title is-4") Parking (P5)
				.level
					button(class="level-item button is-info" v-on:click="parkingScore = 10") Add Park
					.control
						input(class="input" type="text" v-bind:value="parkingScore" readonly)
					button(class="level-item button is-danger" v-on:click="parkingScore = 0") Remove Park
</template>

<script lang="ts">
import Vue from "vue";
import EventBus from "./EventBus";

interface IData {
	running: boolean,
	waterScore: number,
	homeViolationCounter: number,
	isViolatingHome: boolean,
	totalMultiBottleViolationCounter: number,
	currentMultiBottleViolationCounter: number,
	isViolatingMultiBottle: boolean,
	parkingScore: number,
	bottleTippingPenalty: number,
}

export default Vue.component("team", {
	props: ["side"],
	data(): IData {
		return {
			running: false,
			waterScore: 0,
			homeViolationCounter: 0,
			isViolatingHome: false,
			totalMultiBottleViolationCounter: 0,
			currentMultiBottleViolationCounter: 0,
			isViolatingMultiBottle: false,
			parkingScore: 0,
			bottleTippingPenalty: 0,
		};
	},
	methods: {
		stopMultiBottleViolationCounter: function() {
			if(this.isViolatingMultiBottle){
				this.isViolatingMultiBottle = false;

				const userInput = prompt("Peak Bottles Pushed", "1");
				if(!userInput){
					return;
				}

				const multiplier = parseInt(userInput);

				this.totalMultiBottleViolationCounter += this.currentMultiBottleViolationCounter * multiplier;
				this.currentMultiBottleViolationCounter = 0;
			}
		}
	},
	created() {
		EventBus.$on("start", () => {
			this.running = true;
		});

		EventBus.$on("pause", () => {
			this.running = false;
		});

		EventBus.$on("reset", () => {
			this.running = false;
			this.waterScore = 0;
			this.homeViolationCounter = 0;
			this.totalMultiBottleViolationCounter = 0;
			this.currentMultiBottleViolationCounter = 0;
			this.isViolatingMultiBottle = false;
			this.parkingScore = 0;
			this.bottleTippingPenalty = 0;
		});

		EventBus.$on("tick", () => {
			if(this.isViolatingHome){
				this.homeViolationCounter++;
			}

			if(this.isViolatingMultiBottle){
				this.currentMultiBottleViolationCounter++;
			}
		});
	},
	computed: {
		score: function(): number {
			return this.waterScore - this.homeViolationCounter - this.totalMultiBottleViolationCounter + this.parkingScore - this.bottleTippingPenalty;
		}
	}
});
</script>
