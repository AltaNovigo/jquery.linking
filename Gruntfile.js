module.exports = function(grunt){
	
	grunt.initConfig({
		
		pkg: grunt.file.readJSON('package.json'),
		
		jshint: {
			dist: ['Gruntfile.js', 'src/js/<%= pkg.name %>.js']
		},
		
		copy: {
			dist: {
				src: 'src/js/<%= pkg.name %>.js',
				dest: 'dist/js/<%= pkg.name %>.js',
			},
		},
		
		uglify: {
			options: {
				banner: '/*!\n * <%= pkg.name %> v<%= pkg.version %> (<%= pkg.homepage %>)\n * <%= pkg.description %>\n * Copyright 2015-<%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n * License: <%= pkg.license %>\n */\n'
			},
			dist: {
				files: {
					'dist/js/<%= pkg.name %>.min.js': ['<%= copy.dist.dest %>']
				}
			}
		}
		
	});
	
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	
	grunt.registerTask('default', ['jshint:dist', 'copy:dist', 'uglify:dist']);
	
};